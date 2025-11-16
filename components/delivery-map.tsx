import { NavigationService } from "@/services/navigation";
import { DeliveryPoint, Location as LocationType } from "@/types/delivery";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

interface DeliveryMapProps {
  points: DeliveryPoint[];
  currentLocation?: LocationType | null;
  onPointPress?: (point: DeliveryPoint) => void;
}

interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

interface RouteSegment {
  coordinates: RouteCoordinates[];
  color: string;
  destinationId: string;
  isDelivered: boolean;
}

export default function DeliveryMap({
  points,
  currentLocation,
  onPointPress
}: DeliveryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  // Przechowuj mapę stałych numerów paczek (id -> numer)
  const deliveryOrderMap = useRef<Map<string, number>>(new Map());
  // Przechowuj poprzednie wartości, aby uniknąć niepotrzebnych rerenderów
  const prevPointsRef = useRef<string>("");
  const prevLocationRef = useRef<string>("");
  const hasInitializedMap = useRef(false);

  // Klucz do śledzenia zmian statusu punktów
  const pointsStatusKey = points.map(p => `${p.id}-${p.status}`).join(",");

  // Inicjalizuj stałe numery paczek przy pierwszym załadowaniu - tylko raz!
  useEffect(() => {
    if (!currentLocation || isInitialized) return;

    const allPoints = points.map(point => ({
      point,
      distance: NavigationService.calculateDistance(
        currentLocation,
        point.location
      )
    }));

    allPoints.sort((a, b) => a.distance - b.distance);

    allPoints.forEach((item, index) => {
      deliveryOrderMap.current.set(item.point.id, index + 1);
    });

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, isInitialized]);

  // Ustaw markersLoaded po krótkiej chwili, aby markery się załadowały
  useEffect(() => {
    if (isInitialized) {
      // Resetuj markersLoaded gdy punkty się zmienią (zmiana statusu)
      setMarkersLoaded(false);

      const timer = setTimeout(() => {
        setMarkersLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, pointsStatusKey]);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!currentLocation || !isInitialized) {
        setRouteSegments([]);
        return;
      }

      // Sprawdź czy dane się zmieniły, aby uniknąć niepotrzebnych wywołań
      const pointsKey = points.map(p => `${p.id}-${p.status}`).join(",");
      const locationKey = `${currentLocation.latitude.toFixed(
        6
      )},${currentLocation.longitude.toFixed(6)}`;

      if (
        prevPointsRef.current === pointsKey &&
        prevLocationRef.current === locationKey
      ) {
        return;
      }

      prevPointsRef.current = pointsKey;
      prevLocationRef.current = locationKey;

      // Podziel paczki na pending i delivered/failed
      const pendingPoints = points.filter(p => p.status === "pending");
      const deliveredPoints = points.filter(
        p => p.status === "delivered" || p.status === "failed"
      );

      // Sortuj paczki pending według odległości od aktualnej lokalizacji
      const pendingWithDistance = pendingPoints.map(point => ({
        point,
        distance: NavigationService.calculateDistance(
          currentLocation,
          point.location
        )
      }));

      pendingWithDistance.sort((a, b) => a.distance - b.distance);
      const sortedPendingPoints = pendingWithDistance.map(p => p.point);

      // Funkcja generująca kolory - jasny niebieski dla najbliższej, granatowy dla kolejnych
      const generateBlueColor = (index: number): string => {
        // 1. najbliższa: jasny niebieski RGB(33, 150, 243) - pełna opacity
        // 2. druga: granatowy RGB(13, 71, 161) z 60% opacity
        // 3. trzecia: granatowy RGB(13, 71, 161) z 35% opacity
        // 4+ kolejne: granatowy RGB(13, 71, 161) z 20% opacity
        if (index === 0) {
          return "rgb(33, 150, 243)"; // Jasny niebieski, pełna opacity
        } else if (index === 1) {
          return "rgba(13, 71, 161, 0.6)"; // Granatowy 60%
        } else if (index === 2) {
          return "rgba(13, 71, 161, 0.35)"; // Granatowy 35%
        } else {
          return "rgba(13, 71, 161, 0.2)"; // Granatowy 20%
        }
      };

      try {
        const GOOGLE_MAPS_API_KEY =
          process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

        const segments: RouteSegment[] = [];

        // Generuj trasy dla paczek pending
        for (let i = 0; i < sortedPendingPoints.length; i++) {
          const point = sortedPendingPoints[i];
          const color = generateBlueColor(i);

          let routeCoords: RouteCoordinates[];

          if (GOOGLE_MAPS_API_KEY) {
            try {
              const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
              const destination = `${point.location.latitude},${point.location.longitude}`;
              const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

              const response = await fetch(url);
              const data = await response.json();

              if (data.status === "OK" && data.routes.length > 0) {
                routeCoords = decodePolyline(
                  data.routes[0].overview_polyline.points
                );
              } else {
                routeCoords = [currentLocation, point.location];
              }
            } catch {
              routeCoords = [currentLocation, point.location];
            }
          } else {
            routeCoords = [currentLocation, point.location];
          }

          segments.push({
            coordinates: routeCoords,
            color,
            destinationId: point.id,
            isDelivered: false
          });
        }

        // Dodaj zielone trasy dla dostarczonych paczek (10% opacity)
        for (const point of deliveredPoints) {
          let routeCoords: RouteCoordinates[];

          if (GOOGLE_MAPS_API_KEY) {
            try {
              const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
              const destination = `${point.location.latitude},${point.location.longitude}`;
              const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

              const response = await fetch(url);
              const data = await response.json();

              if (data.status === "OK" && data.routes.length > 0) {
                routeCoords = decodePolyline(
                  data.routes[0].overview_polyline.points
                );
              } else {
                routeCoords = [currentLocation, point.location];
              }
            } catch {
              routeCoords = [currentLocation, point.location];
            }
          } else {
            routeCoords = [currentLocation, point.location];
          }

          segments.push({
            coordinates: routeCoords,
            color: "rgba(76, 175, 80, 0.2)", // Zielony z 20% opacity
            destinationId: point.id,
            isDelivered: true
          });
        }

        setRouteSegments(segments);
      } catch {
        // W przypadku błędu, utwórz proste linie
        const segments: RouteSegment[] = [
          ...sortedPendingPoints.map((point, i) => ({
            coordinates: [currentLocation, point.location],
            color: generateBlueColor(i),
            destinationId: point.id,
            isDelivered: false
          })),
          ...deliveredPoints.map(point => ({
            coordinates: [currentLocation, point.location],
            color: "rgba(76, 175, 80, 0.2)",
            destinationId: point.id,
            isDelivered: true
          }))
        ];
        setRouteSegments(segments);
      }
    };

    fetchRoutes();
  }, [points, currentLocation, isInitialized]);

  useEffect(() => {
    if (points.length > 0 && mapRef.current && !hasInitializedMap.current) {
      const coordinates = points.map(p => ({
        latitude: p.location.latitude,
        longitude: p.location.longitude
      }));

      if (currentLocation) {
        coordinates.push(currentLocation);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: false
      });

      hasInitializedMap.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const getMarkerColor = (status: DeliveryPoint["status"]): string => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "delivered":
        return "#4CAF50";
      case "failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  // Funkcja zwracająca stały numer paczki
  const getDeliveryOrder = (point: DeliveryPoint): number => {
    return deliveryOrderMap.current.get(point.id) || 0;
  };

  // Nie renderuj mapy dopóki nie jest zainicjalizowana
  if (!isInitialized || !currentLocation) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing map...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: 49.8225,
          longitude: 19.0447,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        {points.map((point, index) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.location.latitude,
              longitude: point.location.longitude
            }}
            onPress={() => onPointPress && onPointPress(point)}
            title={point.address}
            description={`${point.recipientName} - ${point.packageId}`}
            tracksViewChanges={!markersLoaded}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(point.status) }
              ]}
            >
              <Text style={styles.markerText}>{getDeliveryOrder(point)}</Text>
            </View>
          </Marker>
        ))}

        {/* Najpierw renderuj zielone (dostarczone) */}
        {routeSegments
          .filter(s => s.isDelivered)
          .map((segment, index) => (
            <Polyline
              key={`route-delivered-${segment.destinationId}`}
              coordinates={segment.coordinates}
              strokeColor={segment.color}
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
              zIndex={1}
            />
          ))}

        {/* Potem granatowe (dalsze pending) od najdalszych do najbliższych */}
        {routeSegments
          .filter(s => !s.isDelivered)
          .slice(1)
          .reverse()
          .map((segment, index) => (
            <Polyline
              key={`route-secondary-${segment.destinationId}`}
              coordinates={segment.coordinates}
              strokeColor={segment.color}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              zIndex={10 + index}
            />
          ))}

        {/* Na końcu najbliższa niebieska - zawsze na wierzchu */}
        {routeSegments.filter(s => !s.isDelivered).length > 0 && (
          <Polyline
            key={`route-nearest-${
              routeSegments.find(s => !s.isDelivered)?.destinationId
            }`}
            coordinates={routeSegments.find(s => !s.isDelivered)!.coordinates}
            strokeColor="rgb(33, 150, 243)"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
            zIndex={1000}
          />
        )}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FFA500" }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>Delivered</Text>
        </View>
      </View>
    </View>
  );
}

function decodePolyline(encoded: string): RouteCoordinates[] {
  const poly: RouteCoordinates[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    });
  }

  return poly;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  loadingText: {
    fontSize: 16,
    color: "#666"
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white"
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12
  },
  startMarkerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  },
  startMarkerText: {
    fontSize: 20
  },
  legend: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2
  },
  legendIcon: {
    fontSize: 16,
    marginRight: 6
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  legendText: {
    fontSize: 12
  },
  infoPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  infoPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
  infoPanelSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4
  },
  infoPanelPackage: {
    fontSize: 12,
    color: "#999",
    marginTop: 2
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666"
  },
  navigateButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  navigateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});

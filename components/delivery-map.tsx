import { NavigationService } from "@/services/navigation";
import { DeliveryPoint, Location as LocationType } from "@/types/delivery";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

export default function DeliveryMap({
  points,
  currentLocation,
  onPointPress
}: DeliveryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(
    null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates[]>(
    []
  );

  useEffect(() => {
    const fetchRoute = async () => {
      const allPoints = points
        .filter(p => p.orderNumber)
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

      if (allPoints.length < 2) {
        setRouteCoordinates([]);
        return;
      }

      let sortedPoints = [...allPoints];

      if (currentLocation) {
        const pointsWithDistance = allPoints.map(point => ({
          point,
          distance: Math.sqrt(
            Math.pow(point.location.latitude - currentLocation.latitude, 2) +
              Math.pow(point.location.longitude - currentLocation.longitude, 2)
          )
        }));

        pointsWithDistance.sort((a, b) => a.distance - b.distance);

        const closestIndex = allPoints.findIndex(
          p => p.id === pointsWithDistance[0].point.id
        );

        if (closestIndex > 0) {
          sortedPoints = [
            ...allPoints.slice(closestIndex),
            ...allPoints.slice(0, closestIndex)
          ];
        }
      }

      try {
        const GOOGLE_MAPS_API_KEY =
          process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

        if (!GOOGLE_MAPS_API_KEY) {
          const fallbackRoute = sortedPoints.map(p => ({
            latitude: p.location.latitude,
            longitude: p.location.longitude
          }));
          setRouteCoordinates(fallbackRoute);
          return;
        }

        const startPoint = sortedPoints[0].location;
        const endPoint = sortedPoints[sortedPoints.length - 1].location;
        const origin = `${startPoint.latitude},${startPoint.longitude}`;
        const destination = `${endPoint.latitude},${endPoint.longitude}`;

        let waypointsParam = "";
        if (sortedPoints.length > 2) {
          const middlePoints = sortedPoints.slice(1, -1);
          const waypoints = middlePoints
            .map(p => `${p.location.latitude},${p.location.longitude}`)
            .join("|");
          waypointsParam = `&waypoints=${waypoints}`;
        }

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.routes.length > 0) {
          const routePoints = decodePolyline(
            data.routes[0].overview_polyline.points
          );
          setRouteCoordinates(routePoints);
        } else {
          const fallbackRoute = sortedPoints.map(p => ({
            latitude: p.location.latitude,
            longitude: p.location.longitude
          }));
          setRouteCoordinates(fallbackRoute);
        }
      } catch {
        const fallbackRoute = sortedPoints.map(p => ({
          latitude: p.location.latitude,
          longitude: p.location.longitude
        }));
        setRouteCoordinates(fallbackRoute);
      }
    };

    fetchRoute();
  }, [points, currentLocation]);

  useEffect(() => {
    if (points.length > 0 && mapRef.current) {
      const coordinates = points.map(p => ({
        latitude: p.location.latitude,
        longitude: p.location.longitude
      }));

      if (currentLocation) {
        coordinates.push(currentLocation);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true
      });
    }
  }, [points, currentLocation]);

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

  const handleMarkerPress = (point: DeliveryPoint) => {
    setSelectedPoint(point);
    if (onPointPress) {
      onPointPress(point);
    }
  };

  const handleNavigate = () => {
    if (selectedPoint) {
      NavigationService.openNavigation(
        selectedPoint.location,
        selectedPoint.address
      );
    }
  };

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
            pinColor={getMarkerColor(point.status)}
            onPress={() => handleMarkerPress(point)}
            title={point.address}
            description={`${point.recipientName} - ${point.packageId}`}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(point.status) }
              ]}
            >
              <Text style={styles.markerText}>
                {point.orderNumber || index + 1}
              </Text>
            </View>
          </Marker>
        ))}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2196F3"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
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

      {selectedPoint && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <View>
              <Text style={styles.infoPanelTitle}>{selectedPoint.address}</Text>
              <Text style={styles.infoPanelSubtitle}>
                {selectedPoint.recipientName}
              </Text>
              <Text style={styles.infoPanelPackage}>
                Package: {selectedPoint.packageId}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedPoint(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={handleNavigate}
          >
            <Text style={styles.navigateButtonText}>🧭 Navigate</Text>
          </TouchableOpacity>
        </View>
      )}
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

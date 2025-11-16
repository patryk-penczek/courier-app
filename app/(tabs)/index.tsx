import DeliveryMap from "@/components/delivery-map";
import DeliveryPointDetails from "@/components/delivery-point-details";
import ApiService from "@/services/api";
import { NavigationService } from "@/services/navigation";
import { StorageService } from "@/services/storage";
import {
  DeliveryConfirmation,
  DeliveryPoint,
  Location,
  Route
} from "@/types/delivery";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const [route, setRoute] = useState<Route | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Najpierw pobierz lokalizację
      await getCurrentLocation();
      // Potem załaduj trasę
      await loadRoute();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRoute = async () => {
    try {
      if (!isLocationLoading) {
        setIsLoading(true);
      }

      const { loadMockData } = await import("@/data/mock-data");
      await loadMockData();

      const freshRoute = await StorageService.getRoute();
      if (freshRoute) {
        setRoute(freshRoute);
      }

      try {
        const fetchedRoute = await ApiService.fetchRoute("courier-123");
        setRoute(fetchedRoute);
      } catch {}
    } catch {
      Alert.alert("Error", "Unable to load route.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLocationLoading(true);
      const location = await NavigationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    } catch {
      Alert.alert(
        "Error",
        "Unable to get current location. Please enable location services."
      );
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getCurrentLocation();
    await loadRoute();

    try {
      await ApiService.syncPendingConfirmations();
    } catch {}

    setIsRefreshing(false);
  };

  const handlePointPress = (point: DeliveryPoint) => {
    setSelectedPoint(point);
    setShowDetails(true);
  };

  const handleConfirmDelivery = async (confirmation: DeliveryConfirmation) => {
    if (route) {
      const updatedPoints = route.points.map(p =>
        p.id === confirmation.pointId
          ? { ...p, status: confirmation.status }
          : p
      );
      const updatedRoute = { ...route, points: updatedPoints };
      setRoute(updatedRoute);
      await StorageService.saveRoute(updatedRoute);
    }

    setShowDetails(false);
    setSelectedPoint(null);
  };

  const getStats = () => {
    if (!route) return { total: 0, completed: 0, pending: 0, failed: 0 };

    return {
      total: route.points.length,
      completed: route.points.filter(p => p.status === "delivered").length,
      pending: route.points.filter(p => p.status === "pending").length,
      failed: route.points.filter(p => p.status === "failed").length
    };
  };

  if (isLoading || isLocationLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>
          {isLocationLoading ? "Getting your location..." : "Loading route..."}
        </Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to get location</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={getCurrentLocation}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No route available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRoute}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = getStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.routeName}>{route.name}</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
            <Text style={styles.refreshButton}>
              {isRefreshing ? "⏳" : "🔄"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4CAF50" }]}>
              {stats.completed}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FFA500" }]}>
              {stats.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          {stats.failed > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#F44336" }]}>
                {stats.failed}
              </Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
          )}
        </View>
      </View>

      <DeliveryMap
        points={route.points}
        currentLocation={currentLocation}
        onPointPress={handlePointPress}
      />

      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        {selectedPoint && (
          <DeliveryPointDetails
            point={selectedPoint}
            onConfirm={handleConfirmDelivery}
            onCancel={() => setShowDetails(false)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666"
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  routeName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5
  },
  refreshButton: {
    fontSize: 24,
    padding: 4
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8
  },
  statItem: {
    alignItems: "center"
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2196F3"
  },
  statLabel: {
    fontSize: 11,
    color: "#757575",
    marginTop: 4,
    fontWeight: "500"
  }
});

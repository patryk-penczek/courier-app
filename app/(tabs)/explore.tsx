import DeliveryPointDetails from "@/components/delivery-point-details";
import { NavigationService } from "@/services/navigation";
import { StorageService } from "@/services/storage";
import { DeliveryConfirmation, DeliveryPoint, Route } from "@/types/delivery";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

function PointCard({
  point,
  index,
  onPress
}: {
  point: DeliveryPoint;
  index: number;
  onPress: () => void;
}) {
  const [distance, setDistance] = useState<string>("...");

  useEffect(() => {
    const loadDistance = async () => {
      try {
        const currentLocation = await NavigationService.getCurrentLocation();
        if (!currentLocation) {
          setDistance("---");
          return;
        }
        const dist = NavigationService.calculateDistance(
          currentLocation,
          point.location
        );
        setDistance(NavigationService.formatDistance(dist));
      } catch {
        setDistance("---");
      }
    };
    loadDistance();
  }, [point]);

  const getStatusColor = (status: DeliveryPoint["status"]): string => {
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

  const getStatusText = (status: DeliveryPoint["status"]): string => {
    switch (status) {
      case "pending":
        return "Pending";
      case "delivered":
        return "Delivered";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity style={styles.pointCard} onPress={onPress}>
      <View style={styles.pointHeader}>
        <View style={styles.pointNumber}>
          <Text style={styles.pointNumberText}>
            {point.orderNumber || index + 1}
          </Text>
        </View>
        <View style={styles.pointInfo}>
          <Text style={styles.pointAddress}>{point.address}</Text>
          <Text style={styles.pointRecipient}>{point.recipientName}</Text>
          <Text style={styles.pointPackage}>📦 {point.packageId}</Text>
        </View>
        <View style={styles.pointRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(point.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(point.status)}</Text>
          </View>
          <Text style={styles.distanceText}>📍 {distance}</Text>
        </View>
      </View>
      {point.specialInstructions && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ {point.specialInstructions}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DeliveryListScreen() {
  const [route, setRoute] = useState<Route | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "delivered" | "failed"
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoute();
  }, []);

  const loadRoute = async () => {
    try {
      setIsLoading(true);
      const savedRoute = await StorageService.getRoute();
      setRoute(savedRoute);
    } finally {
      setIsLoading(false);
    }
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

  const getFilteredPoints = (): DeliveryPoint[] => {
    if (!route) return [];

    switch (filter) {
      case "pending":
        return route.points.filter(p => p.status === "pending");
      case "delivered":
        return route.points.filter(p => p.status === "delivered");
      case "failed":
        return route.points.filter(p => p.status === "failed");
      default:
        return route.points;
    }
  };

  const renderPoint = ({
    item,
    index
  }: {
    item: DeliveryPoint;
    index: number;
  }) => {
    return (
      <PointCard
        point={item}
        index={index}
        onPress={() => handlePointPress(item)}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!route || route.points.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No points on route</Text>
      </View>
    );
  }

  const filteredPoints = getFilteredPoints();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{route.name}</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPoints.length}{" "}
          {filteredPoints.length === 1 ? "point" : "points"}
        </Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "pending" && styles.filterButtonActive
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "pending" && styles.filterTextActive
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "delivered" && styles.filterButtonActive
          ]}
          onPress={() => setFilter("delivered")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "delivered" && styles.filterTextActive
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "failed" && styles.filterButtonActive
          ]}
          onPress={() => setFilter("failed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "failed" && styles.filterTextActive
            ]}
          >
            Failed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPoints}
        renderItem={renderPoint}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No points in this category</Text>
          </View>
        }
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
  emptyText: {
    fontSize: 16,
    color: "#999"
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#757575",
    marginTop: 4,
    fontWeight: "500"
  },
  filterContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center"
  },
  filterButtonActive: {
    backgroundColor: "#2196F3"
  },
  filterText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "600"
  },
  filterTextActive: {
    color: "#FFFFFF"
  },
  listContent: {
    padding: 16
  },
  pointCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  pointHeader: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  pointNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  pointNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  pointInfo: {
    flex: 1
  },
  pointAddress: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 20
  },
  pointRecipient: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 2
  },
  pointPackage: {
    fontSize: 12,
    color: "#999999"
  },
  pointRight: {
    alignItems: "flex-end",
    marginLeft: 8
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 8
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  distanceText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500"
  },
  warningBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9800"
  },
  warningText: {
    fontSize: 12,
    color: "#E65100",
    lineHeight: 18
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center"
  }
});

import ApiService from "@/services/api";
import { NavigationService } from "@/services/navigation";
import { SpeechService } from "@/services/speech";
import { DeliveryConfirmation, DeliveryPoint } from "@/types/delivery";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface DeliveryPointDetailsProps {
  point: DeliveryPoint;
  onConfirm?: (confirmation: DeliveryConfirmation) => void;
  onCancel?: () => void;
}

export default function DeliveryPointDetails({
  point,
  onConfirm,
  onCancel
}: DeliveryPointDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleNavigate = () => {
    NavigationService.openNavigation(point.location, point.address);
  };

  const handleCall = () => {
    if (point.recipientPhone) {
      Linking.openURL(`tel:${point.recipientPhone}`);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      await SpeechService.speakDeliveryInfo(point);
      setIsSpeaking(false);
    }
  };

  const handleConfirmDelivery = async (status: "delivered" | "failed") => {
    Alert.alert(
      "Confirmation",
      status === "delivered"
        ? "Are you sure you want to confirm delivery?"
        : "Are you sure you want to mark as failed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setIsLoading(true);
            try {
              const confirmation: DeliveryConfirmation = {
                pointId: point.id,
                status,
                timestamp: new Date().toISOString()
              };

              await ApiService.confirmDelivery(confirmation);

              if (onConfirm) {
                onConfirm(confirmation);
              }

              Alert.alert(
                "Success",
                status === "delivered"
                  ? "Delivery confirmed"
                  : "Marked as failed"
              );
            } catch {
              Alert.alert(
                "Notice",
                "Confirmation saved offline. Will be sent when connection is available."
              );

              if (onConfirm) {
                const confirmation: DeliveryConfirmation = {
                  pointId: point.id,
                  status,
                  timestamp: new Date().toISOString()
                };
                onConfirm(confirmation);
              }
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {point.type === "pickup" ? "📦 Pickup" : "🚚 Delivery"}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(point.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(point.status)}</Text>
          </View>
        </View>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Package Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Package Number:</Text>
          <Text style={styles.value}>{point.packageId}</Text>
        </View>
        {point.packageDescription && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{point.packageDescription}</Text>
          </View>
        )}
        {point.orderNumber && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order:</Text>
            <Text style={styles.value}>#{point.orderNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipient</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{point.recipientName}</Text>
        </View>
        {point.recipientPhone && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text style={[styles.value, styles.link]}>
                {point.recipientPhone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{point.address}</Text>
        </View>
      </View>

      {(point.specialInstructions || point.notes) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          {point.specialInstructions && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                ⚠️ {point.specialInstructions}
              </Text>
            </View>
          )}
          {point.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{point.notes}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
          <Text style={styles.actionButtonText}>🧭 Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.speakButton]}
          onPress={handleSpeak}
        >
          <Text style={styles.actionButtonText}>
            {isSpeaking ? "🔇 Stop" : "🔊 Play"}
          </Text>
        </TouchableOpacity>
      </View>

      {point.status !== "delivered" && point.status !== "failed" && (
        <View style={styles.confirmSection}>
          <TouchableOpacity
            style={[styles.confirmButton, styles.successButton]}
            onPress={() => handleConfirmDelivery("delivered")}
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonText}>
              {isLoading ? "⏳ Loading..." : "✅ Confirm Delivery"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmButton, styles.failButton]}
            onPress={() => handleConfirmDelivery("failed")}
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonText}>❌ Failed Delivery</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start"
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold"
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666"
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333"
  },
  infoRow: {
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4
  },
  value: {
    fontSize: 16,
    color: "#333"
  },
  link: {
    color: "#2196F3",
    textDecorationLine: "underline"
  },
  alertBox: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 12
  },
  alertText: {
    fontSize: 14,
    color: "#E65100"
  },
  actionsSection: {
    flexDirection: "row",
    padding: 16,
    gap: 12
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  speakButton: {
    backgroundColor: "#9C27B0"
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  confirmSection: {
    padding: 16,
    gap: 12
  },
  confirmButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center"
  },
  successButton: {
    backgroundColor: "#4CAF50"
  },
  failButton: {
    backgroundColor: "#F44336"
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});

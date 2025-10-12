import { Location as LocationType } from "@/types/delivery";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";

export const NavigationService = {
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  },

  async getCurrentLocation(): Promise<LocationType | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch {
      return null;
    }
  },

  async openNavigation(
    destination: LocationType,
    label?: string
  ): Promise<void> {
    const { latitude, longitude } = destination;
    const encodedLabel = label ? encodeURIComponent(label) : "";

    let url = "";

    if (Platform.OS === "ios") {
      url = `maps://app?daddr=${latitude},${longitude}&q=${encodedLabel}`;
    } else {
      url = `google.navigation:q=${latitude},${longitude}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        await Linking.openURL(browserUrl);
      }
    } catch {
      throw new Error("Nie można otworzyć nawigacji");
    }
  },

  calculateDistance(from: LocationType, to: LocationType): number {
    const R = 6371e3;
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

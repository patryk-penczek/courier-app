import { DeliveryConfirmation, DeliveryPoint, Route } from "@/types/delivery";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  CURRENT_ROUTE: "@courier_app:current_route",
  PENDING_CONFIRMATIONS: "@courier_app:pending_confirmations",
  LAST_SYNC: "@courier_app:last_sync"
};

export const StorageService = {

  async saveRoute(route: Route): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_ROUTE,
        JSON.stringify(route)
      );
    } catch (error) {
      throw error;
    }
  },


  async getRoute(): Promise<Route | null> {
    try {
      const routeJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_ROUTE);
      return routeJson ? JSON.parse(routeJson) : null;
    } catch (error) {
      return null;
    }
  },


  async updatePointStatus(
    pointId: string,
    status: DeliveryPoint["status"]
  ): Promise<void> {
    try {
      const route = await this.getRoute();
      if (!route) return;

      const updatedPoints = route.points.map(point =>
        point.id === pointId ? { ...point, status } : point
      );

      await this.saveRoute({ ...route, points: updatedPoints });
    } catch (error) {
      throw error;
    }
  },


  async savePendingConfirmation(
    confirmation: DeliveryConfirmation
  ): Promise<void> {
    try {
      const existing = await this.getPendingConfirmations();
      const updated = [...existing, confirmation];
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_CONFIRMATIONS,
        JSON.stringify(updated)
      );
    } catch (error) {
      throw error;
    }
  },


  async getPendingConfirmations(): Promise<DeliveryConfirmation[]> {
    try {
      const confirmationsJson = await AsyncStorage.getItem(
        STORAGE_KEYS.PENDING_CONFIRMATIONS
      );
      return confirmationsJson ? JSON.parse(confirmationsJson) : [];
    } catch (error) {
      return [];
    }
  },


  async clearPendingConfirmations(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_CONFIRMATIONS,
        JSON.stringify([])
      );
    } catch (error) {
      throw error;
    }
  },


  async setLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
    } catch (error) {
    }
  },


  async getLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      return null;
    }
  },


  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_ROUTE,
        STORAGE_KEYS.PENDING_CONFIRMATIONS,
        STORAGE_KEYS.LAST_SYNC
      ]);
    } catch (error) {
      throw error;
    }
  }
};

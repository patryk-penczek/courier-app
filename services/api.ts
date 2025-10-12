import { DeliveryConfirmation, DeliveryPoint, Route } from "@/types/delivery";
import axios, { AxiosInstance } from "axios";
import { StorageService } from "./storage";

const API_BASE_URL = "https://your-api-server.com/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async fetchRoute(courierId: string): Promise<Route> {
    try {
      const response = await this.client.get<Route>(
        `/routes/${courierId}/current`
      );

      await StorageService.saveRoute(response.data);
      await StorageService.setLastSync();
      return response.data;
    } catch {
      const cachedRoute = await StorageService.getRoute();
      if (cachedRoute) {
        return cachedRoute;
      }
      throw new Error(
        "Unable to fetch route. No connection and no cached data."
      );
    }
  }

  async confirmDelivery(confirmation: DeliveryConfirmation): Promise<void> {
    try {
      await this.client.post("/deliveries/confirm", confirmation);

      await StorageService.updatePointStatus(
        confirmation.pointId,
        confirmation.status
      );
    } catch {
      await StorageService.savePendingConfirmation(confirmation);

      await StorageService.updatePointStatus(
        confirmation.pointId,
        confirmation.status
      );
      throw new Error(
        "Confirmation saved offline. Will be sent when connection is available."
      );
    }
  }

  async syncPendingConfirmations(): Promise<void> {
    try {
      const pending = await StorageService.getPendingConfirmations();
      if (pending.length === 0) return;

      await this.client.post("/deliveries/confirm/batch", {
        confirmations: pending
      });
      await StorageService.clearPendingConfirmations();
    } catch {}
  }

  async updateLocation(
    courierId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      await this.client.post("/couriers/location", {
        courierId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });
    } catch {}
  }

  async getDeliveryPointDetails(pointId: string): Promise<DeliveryPoint> {
    try {
      const response = await this.client.get<DeliveryPoint>(
        `/delivery-points/${pointId}`
      );
      return response.data;
    } catch {
      throw new Error("Unable to fetch point details");
    }
  }
}

export default new ApiService();

export type DeliveryStatus = "pending" | "delivered" | "failed";

export type DeliveryType = "pickup" | "delivery";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DeliveryPoint {
  id: string;
  type: DeliveryType;
  address: string;
  location: Location;
  recipientName: string;
  recipientPhone?: string;
  packageId: string;
  packageDescription?: string;
  notes?: string;
  status: DeliveryStatus;
  estimatedTime?: string;
  orderNumber?: number;
  specialInstructions?: string;
}

export interface Route {
  id: string;
  name: string;
  date: string;
  points: DeliveryPoint[];
  totalDistance?: number;
  estimatedDuration?: number;
}

export interface DeliveryConfirmation {
  pointId: string;
  status: DeliveryStatus;
  timestamp: string;
  signature?: string;
  photo?: string;
  notes?: string;
}

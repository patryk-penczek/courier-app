import { Route } from "@/types/delivery";

export const mockRoute: Route = {
  id: "route-001",
  name: "Route - October 12, 2025",
  date: "2025-10-12",
  totalDistance: 28000,
  estimatedDuration: 270,
  points: [
    {
      id: "point-001",
      type: "delivery",
      address: "ul. Sobieskiego 17, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.8316,
        longitude: 19.0383
      },
      recipientName: "Galeria Wzorcownia",
      recipientPhone: "+48 33 496 19 99",
      packageId: "PKG-2025-001",
      packageDescription: "Standard package - 3kg",
      status: "pending",
      orderNumber: 1,
      notes: "Delivery to pickup point in the gallery"
    },
    {
      id: "point-002",
      type: "delivery",
      address: "ul. Piastowska 42, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.8152,
        longitude: 19.0304
      },
      recipientName: "Bielskie Centrum Kultury",
      recipientPhone: "+48 33 496 65 00",
      packageId: "PKG-2025-002",
      packageDescription: "Business documents",
      status: "pending",
      orderNumber: 2,
      specialInstructions: "Delivery to reception"
    },
    {
      id: "point-003",
      type: "delivery",
      address: "ul. Komorowicka 56, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.8073,
        longitude: 19.0295
      },
      recipientName: "Selleo",
      recipientPhone: "+48 33 815 50 50",
      packageId: "PKG-2025-003",
      packageDescription: "Business laptop",
      status: "delivered",
      orderNumber: 3,
      notes: "Delivered to office"
    },
    {
      id: "point-004",
      type: "delivery",
      address: "ul. Górska 15, 43-309 Bielsko-Biała (Mikuszowice Krakowskie)",
      location: {
        latitude: 49.8411,
        longitude: 19.0621
      },
      recipientName: "Firma Transportowa ABC",
      recipientPhone: "+48 33 488 40 00",
      packageId: "PKG-2025-004",
      packageDescription: "Car parts",
      status: "pending",
      orderNumber: 4,
      notes: "Call before arrival"
    },
    {
      id: "point-005",
      type: "delivery",
      address: "ul. Karpacka 24, 43-316 Bielsko-Biała (Lipnik)",
      location: {
        latitude: 49.7924,
        longitude: 19.0187
      },
      recipientName: "Sklep Osiedlowy Lipnik",
      recipientPhone: "+48 33 812 51 11",
      packageId: "PKG-2025-005",
      packageDescription: "Food products",
      status: "pending",
      orderNumber: 5,
      specialInstructions: "Delivery to warehouse - back of building"
    },
    {
      id: "point-006",
      type: "delivery",
      address: "ul. Cygański Las 2, 43-309 Bielsko-Biała",
      location: {
        latitude: 49.8171,
        longitude: 19.0525
      },
      recipientName: "Park Technologiczny EURO-CENTRUM",
      recipientPhone: "+48 33 496 29 00",
      packageId: "PKG-2025-006",
      packageDescription: "Computer equipment",
      status: "pending",
      orderNumber: 6
    },
    {
      id: "point-007",
      type: "delivery",
      address: "ul. Krakowska 17, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.8292,
        longitude: 19.0428
      },
      recipientName: "Teatr Polski",
      recipientPhone: "+48 33 822 28 05",
      packageId: "PKG-2025-007",
      packageDescription: "Theater costumes",
      status: "pending",
      orderNumber: 7
    },
    {
      id: "point-008",
      type: "pickup",
      address: "ul. Wyzwolenia 46, 43-300 Bielsko-Biała (Kamienica)",
      location: {
        latitude: 49.8518,
        longitude: 19.0102
      },
      recipientName: "Punkt Pocztowy Kamienica",
      recipientPhone: "+48 33 488 88 88",
      packageId: "PKG-2025-008",
      packageDescription: "Return pickup - electronics",
      status: "pending",
      orderNumber: 8,
      specialInstructions: "Check package condition"
    },
    {
      id: "point-009",
      type: "delivery",
      address: "ul. Sarni Stok 2, 43-300 Bielsko-Biała (Leszczyny)",
      location: {
        latitude: 49.7879,
        longitude: 19.0573
      },
      recipientName: "Aquapark Bielsko-Biała",
      recipientPhone: "+48 33 499 09 99",
      packageId: "PKG-2025-009",
      packageDescription: "Promotional materials",
      status: "pending",
      orderNumber: 9
    },
    {
      id: "point-010",
      type: "delivery",
      address: "ul. Warszawska 20, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.8201,
        longitude: 19.0422
      },
      recipientName: "Galeria Sfera",
      recipientPhone: "+48 33 499 31 00",
      packageId: "PKG-2025-010",
      packageDescription: "Courier package",
      status: "pending",
      orderNumber: 10,
      notes: "Deliver before 6:00 PM"
    }
  ]
};

export async function loadMockData() {
  const { StorageService } = await import("@/services/storage");
  await StorageService.saveRoute(mockRoute);
}

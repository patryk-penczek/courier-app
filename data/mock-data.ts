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
        latitude: 49.82047266097686,
        longitude: 19.039027829991102
      },
      recipientName: "Galeria Wzorcownia",
      recipientPhone: "+48 33 496 19 99",
      packageId: "PKG-2025-001",
      packageDescription: "Standard package - 3kg",
      status: "pending",
      notes: "Delivery to pickup point in the gallery"
    },
    {
      id: "point-002",
      type: "delivery",
      address: "ul. Piastowska 42, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.82558264226615,
        longitude: 19.03066073102912
      },
      recipientName: "Bielskie Centrum Kultury",
      recipientPhone: "+48 33 496 65 00",
      packageId: "PKG-2025-002",
      packageDescription: "Business documents",
      status: "pending",
      specialInstructions: "Delivery to reception"
    },
    {
      id: "point-003",
      type: "delivery",
      address: "ul. Komorowicka 56, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.82813314209808,
        longitude: 19.053366052946295
      },
      recipientName: "Selleo",
      recipientPhone: "+48 33 815 50 50",
      packageId: "PKG-2025-003",
      packageDescription: "Business laptop",
      status: "delivered",
      notes: "Delivered to office"
    },
    {
      id: "point-004",
      type: "delivery",
      address: "ul. Górska 15, 43-309 Bielsko-Biała (Mikuszowice Krakowskie)",
      location: {
        latitude: 49.80236510363956,
        longitude: 19.079470333953967
      },
      recipientName: "Firma Transportowa ABC",
      recipientPhone: "+48 33 488 40 00",
      packageId: "PKG-2025-004",
      packageDescription: "Car parts",
      status: "pending",
      notes: "Call before arrival"
    },
    {
      id: "point-005",
      type: "delivery",
      address: "ul. Karpacka 24, 43-316 Bielsko-Biała (Lipnik)",
      location: {
        latitude: 49.80773538203632,
        longitude: 19.03805943089375
      },
      recipientName: "Sklep Osiedlowy Lipnik",
      recipientPhone: "+48 33 812 51 11",
      packageId: "PKG-2025-005",
      packageDescription: "Food products",
      status: "pending",
      specialInstructions: "Delivery to warehouse - back of building"
    },
    {
      id: "point-006",
      type: "delivery",
      address: "ul. Cygański Las 2, 43-309 Bielsko-Biała",
      location: {
        latitude: 49.78485698706775,
        longitude: 19.04060964295933
      },
      recipientName: "Park Technologiczny EURO-CENTRUM",
      recipientPhone: "+48 33 496 29 00",
      packageId: "PKG-2025-006",
      packageDescription: "Computer equipment",
      status: "pending"
    },
    {
      id: "point-007",
      type: "delivery",
      address: "ul. Krakowska 17, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.821508523614305,
        longitude: 19.062134355797028
      },
      recipientName: "Teatr Polski",
      recipientPhone: "+48 33 822 28 05",
      packageId: "PKG-2025-007",
      packageDescription: "Theater costumes",
      status: "pending"
    },
    {
      id: "point-008",
      type: "pickup",
      address: "ul. Wyzwolenia 46, 43-300 Bielsko-Biała (Kamienica)",
      location: {
        latitude: 49.827043878455264,
        longitude: 19.06102892301074
      },
      recipientName: "Punkt Pocztowy Kamienica",
      recipientPhone: "+48 33 488 88 88",
      packageId: "PKG-2025-008",
      packageDescription: "Return pickup - electronics",
      status: "pending",
      specialInstructions: "Check package condition"
    },
    {
      id: "point-009",
      type: "delivery",
      address: "ul. Sarni Stok 2, 43-300 Bielsko-Biała (Leszczyny)",
      location: {
        latitude: 49.8396373357689,
        longitude: 19.0362575330834
      },
      recipientName: "Aquapark Bielsko-Biała",
      recipientPhone: "+48 33 499 09 99",
      packageId: "PKG-2025-009",
      packageDescription: "Promotional materials",
      status: "pending"
    },
    {
      id: "point-010",
      type: "delivery",
      address: "ul. Warszawska 20, 43-300 Bielsko-Biała",
      location: {
        latitude: 49.82729543647303,
        longitude: 19.049579134730436
      },
      recipientName: "Galeria Sfera",
      recipientPhone: "+48 33 499 31 00",
      packageId: "PKG-2025-010",
      packageDescription: "Courier package",
      status: "pending",
      notes: "Deliver before 6:00 PM"
    }
  ]
};

export async function loadMockData() {
  const { StorageService } = await import("@/services/storage");
  await StorageService.saveRoute(mockRoute);
}

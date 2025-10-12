import { DeliveryPoint } from "@/types/delivery";
import * as Speech from "expo-speech";

export const SpeechService = {
  async speakDeliveryInfo(point: DeliveryPoint): Promise<void> {
    try {
      const message = this.createDeliveryMessage(point);
      await Speech.speak(message, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.9
      });
    } catch {}
  },

  createDeliveryMessage(point: DeliveryPoint): string {
    const parts = [];
    if (point.type === "pickup") {
      parts.push("Package pickup.");
    } else {
      parts.push("Package delivery.");
    }

    parts.push(`Address: ${point.address}.`);
    parts.push(`Recipient: ${point.recipientName}.`);
    parts.push(`Package number: ${point.packageId}.`);

    if (point.specialInstructions) {
      parts.push(`Note: ${point.specialInstructions}.`);
    }

    if (point.notes) {
      parts.push(`Additional note: ${point.notes}.`);
    }

    return parts.join(" ");
  },

  stop(): void {
    Speech.stop();
  },

  async isSpeaking(): Promise<boolean> {
    return await Speech.isSpeakingAsync();
  }
};

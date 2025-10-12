import { HapticTab } from "@/components/haptic-tab";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          elevation: 8,
          minHeight: 72,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600"
        },
        tabBarIconStyle: {
          marginTop: 4
        },
        headerShown: false,
        tabBarButton: HapticTab
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🗺️</Text>
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "List",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📋</Text>
        }}
      />
    </Tabs>
  );
}

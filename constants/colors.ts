/**
 * Unified color palette for the application
 * Ensures consistency across all screens
 */

export const Colors = {
  // Primary
  primary: "#2196F3",
  primaryDark: "#1976D2",
  primaryLight: "#BBDEFB",

  // Background
  background: "#F5F5F5",
  surface: "#FFFFFF",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#757575",
  textTertiary: "#999999",

  // Status
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // UI Elements
  border: "#E0E0E0",
  divider: "#EEEEEE",
  disabled: "#BDBDBD",

  // Shadows
  shadowColor: "#000000",

  // Tab Bar
  tabBarActiveTint: "#2196F3",
  tabBarInactiveTint: "#757575",
  tabBarBackground: "#FFFFFF",
  tabBarBorder: "#E0E0E0"
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
} as const;

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.5
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.5
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: "600" as const
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const
  },
  small: {
    fontSize: 11,
    fontWeight: "500" as const
  }
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999
} as const;

export const Shadows = {
  small: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  medium: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  large: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5
  }
} as const;

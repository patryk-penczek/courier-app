# 🚚 Courier App

Professional mobile application for courier services with offline-first architecture, real-time navigation, and intelligent route optimization.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.13-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [API Integration](#api-integration)
- [Offline Support](#offline-support)
- [Performance](#performance)
- [Security](#security)

## 🎯 Overview

Courier App is a production-ready mobile application designed for professional courier services. It provides real-time GPS tracking, intelligent route optimization, offline capabilities, and seamless navigation integration with native map applications.

### Key Highlights

- **Offline-First**: Full functionality without internet connection
- **Smart Routing**: Automatic route calculation starting from nearest delivery point
- **Native Integration**: Seamless handoff to Apple Maps/Google Maps
- **Multi-Platform**: iOS, Android, and Web support
- **Type-Safe**: 100% TypeScript with strict mode
- **Production Ready**: Enterprise-grade error handling and data persistence

## ✨ Features

### 🗺️ Interactive Map View

- Real-time visualization of all delivery points
- Color-coded markers by delivery status (pending/delivered/failed)
- Optimized route display with Google Maps Directions API
- Current location tracking with high accuracy
- Smart route calculation from courier's nearest point

### 🧭 GPS Navigation

- One-tap navigation to delivery points
- Automatic detection of available navigation apps
- Deep linking to Apple Maps (iOS) and Google Maps (Android/iOS)
- Distance calculation using Haversine formula

### 📦 Delivery Management

- Complete package information and recipient details
- Special delivery instructions
- Quick status updates (delivered/failed)
- Optional notes for each delivery
- Order number tracking

### 🔊 Voice Synthesis

- Polish language text-to-speech
- Hands-free delivery information
- Address and package details read aloud

### 💾 Offline Capabilities

- Local data persistence with AsyncStorage
- Automatic synchronization when online
- Queued delivery confirmations
- Cached route data
- No data loss during network interruptions

### 📱 Modern UI/UX

- Material Design principles
- Unified design system with consistent spacing and colors
- Responsive layouts for tablets
- Tab-based navigation with haptic feedback
- iOS and Android platform optimizations

## 🛠 Tech Stack

### Core

- **React Native** `0.81.4` - Cross-platform mobile framework
- **TypeScript** `5.9.2` - Type-safe development
- **Expo** `54.0.13` - Development platform and tooling
- **Expo Router** `6.0.11` - File-based routing

### Key Libraries

- **react-native-maps** `1.20.1` - Native map components
- **AsyncStorage** `2.2.0` - Local data persistence
- **Axios** `1.12.2` - HTTP client
- **Expo Location** `19.0.7` - GPS and geolocation
- **Expo Speech** `14.0.7` - Text-to-speech synthesis
- **React Navigation** `7.1.8` - Navigation infrastructure

### Development

- **ESLint** `9.25.0` - Code quality
- **Strict TypeScript** - Maximum type safety
- **React Compiler** - Experimental optimizations
- **New Architecture** - React Native's new architecture enabled

## 🏗 Architecture

### Design Patterns

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Components, Screens, UI Logic)        │
├─────────────────────────────────────────┤
│           Service Layer                 │
│  (API, Storage, Navigation, Speech)     │
├─────────────────────────────────────────┤
│           Data Layer                    │
│  (Types, Models, AsyncStorage)          │
└─────────────────────────────────────────┘
```

### Key Principles

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Offline-First**: All operations work without network, sync when available
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Error Resilience**: Graceful degradation and error recovery
- **Performance**: Optimized rendering and efficient data handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- iOS: Xcode 15+ (for iOS development)
- Android: Android Studio and JDK 17 (for Android development)
- Expo Go app (for quick testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd courier-app

# Install dependencies
npm install

# Start development server
npm start
```

### Quick Start Options

#### Option 1: Expo Go (Fastest)

```bash
npm start
# Scan QR code with Expo Go app (iOS/Android)
```

#### Option 2: iOS Simulator

```bash
npm run ios
```

#### Option 3: Android Emulator

```bash
npm run android
```

#### Option 4: Web Browser

```bash
npm run web
```

## 📁 Project Structure

```
courier-app/
├── app/                          # Application screens (Expo Router)
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry redirect
│   └── (tabs)/                  # Tab navigation
│       ├── _layout.tsx          # Tab bar configuration
│       ├── _layout.web.tsx      # Web-specific tab layout
│       ├── index.tsx            # Map view screen
│       ├── index.web.tsx        # Web map screen
│       └── explore.tsx          # List view screen
├── components/                   # Reusable components
│   ├── delivery-map.tsx         # Native map component
│   ├── delivery-map.web.tsx     # Web map component
│   ├── delivery-point-details.tsx # Point detail modal
│   ├── haptic-tab.tsx          # Tab with haptic feedback
│   └── ui/                      # UI primitives
├── services/                    # Business logic layer
│   ├── api.ts                  # API client with offline support
│   ├── storage.ts              # AsyncStorage wrapper
│   ├── navigation.ts           # GPS and map navigation
│   └── speech.ts               # Text-to-speech service
├── types/                      # TypeScript definitions
│   └── delivery.ts             # Core data models
├── constants/                  # App-wide constants
│   ├── colors.ts              # Design system
│   └── theme.ts               # Theme configuration
├── data/                       # Static data
│   └── mock-data.ts           # Development mock data
├── assets/                     # Static assets
│   └── images/                # Icons and images
├── app.json                    # Expo configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Google Maps Directions API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# API Backend
API_BASE_URL=https://your-api-server.com/api

# Courier ID (for development)
COURIER_ID=courier_123
```

### Google Maps Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps SDK for iOS
   - Maps SDK for Android
   - Directions API
3. Create API keys with appropriate restrictions
4. Add keys to `.env` file (never commit to git)

### App Configuration

Edit `app.json` for app metadata:

```json
{
  "expo": {
    "name": "Your Courier App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.courierapp"
    },
    "android": {
      "package": "com.yourcompany.courierapp"
    }
  }
}
```

## 💻 Development

### Development Workflow

```bash
# Start with cache cleared
npm run start:clear

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Code Quality Standards

- **TypeScript Strict Mode**: Enabled for maximum type safety
- **ESLint**: Enforced code style and quality rules
- **No Console Logs**: Production code should not contain console statements
- **Error Handling**: All async operations wrapped in try-catch
- **Immutable Updates**: Using spread operators for state updates

### Design System

All components use the unified design system from `constants/colors.ts`:

```typescript
import { Colors, Spacing, Typography, Shadows } from "@/constants/colors";

// Use in StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.lg
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary
  }
});
```

## 🔌 API Integration

### ApiService Architecture

The `ApiService` class provides a centralized HTTP client with offline support:

```typescript
import ApiService from "@/services/api";

// Fetch route (with offline fallback)
const route = await ApiService.fetchRoute(courierId);

// Confirm delivery (queued if offline)
await ApiService.confirmDelivery({
  pointId: "point_123",
  status: "delivered",
  timestamp: new Date().toISOString(),
  notes: "Package delivered"
});

// Sync pending confirmations
await ApiService.syncPendingConfirmations();
```

### API Endpoints Expected

```
GET    /routes/{courierId}/current        # Fetch current route
POST   /deliveries/confirm                # Confirm single delivery
POST   /deliveries/confirm/batch          # Sync batch confirmations
POST   /couriers/location                 # Update courier location
GET    /delivery-points/{pointId}         # Get point details
```

## 💾 Offline Support

### Data Persistence Strategy

```typescript
import { StorageService } from "@/services/storage";

// Save route locally
await StorageService.saveRoute(route);

// Update point status
await StorageService.updatePointStatus(pointId, "delivered");

// Queue confirmation for later sync
await StorageService.savePendingConfirmation(confirmation);
```

### Offline Behavior

1. **Route Loading**: Fetches from API, falls back to cached data
2. **Status Updates**: Always saved locally first
3. **Confirmations**: Queued and synced when connection restored
4. **Location Updates**: Attempted silently, no user-facing errors
5. **Sync Indicator**: Last sync timestamp displayed to user

## ⚡️ Performance

### Optimizations

- **Route Calculation**: Memoized with `useMemo` to prevent unnecessary recalculation
- **Map Rendering**: Optimized coordinate updates with dependency tracking
- **List Virtualization**: Efficient rendering of large delivery lists
- **Image Optimization**: Expo Image with caching and lazy loading
- **React Compiler**: Experimental compiler enabled for automatic optimizations

### Best Practices

- Avoid inline function definitions in render
- Use `React.memo` for expensive components
- Minimize state updates and re-renders
- Efficient filtering and sorting operations
- Proper cleanup of listeners and subscriptions

## 🔒 Security

### Security Measures

- **API Keys**: Never committed to repository, stored in `.env` (gitignored)
- **HTTPS Only**: All API communication over secure connections
- **Input Validation**: TypeScript types enforce data structure
- **Token Storage**: Secure storage for authentication tokens
- **Permission Handling**: Proper iOS/Android permission requests

### Sensitive Data Handling

```typescript
// ❌ NEVER do this
const API_KEY = "AIzaSyDv1K6z...";

// ✅ Always use environment variables
const API_KEY = process.env.GOOGLE_MAPS_API_KEY_IOS;
```

### Permissions Required

**iOS** (`Info.plist`):

- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`
- `NSSpeechRecognitionUsageDescription`

**Android** (`AndroidManifest.xml`):

- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

## 📱 Platform-Specific Considerations

### iOS

- Tab bar height: 85px (includes safe area)
- Uses Apple Maps for navigation
- Haptic feedback on tab press
- Smooth animations with native driver

### Android

- Tab bar height: 65px
- Uses Google Maps for navigation
- Material Design ripple effects
- Edge-to-edge display mode

### Web

- Fallback landing page with installation instructions
- Responsive design for mobile/tablet/desktop
- Links to Expo Go download
- Feature showcase and documentation

## 🤝 Contributing

### Development Guidelines

1. Follow the existing code style and structure
2. Write TypeScript with strict mode compliance
3. Use the design system for all UI components
4. Test offline scenarios thoroughly
5. Ensure cross-platform compatibility
6. Document complex logic with JSDoc comments (sparingly)

### Commit Conventions

```bash
feat: Add new feature
fix: Fix bug
refactor: Code refactoring
style: UI/UX improvements
docs: Documentation updates
perf: Performance improvements
```

## 📄 License

Proprietary - All rights reserved

## 👥 Author

[Patryk Penczek](https://patrykpenczek.pl)

---

**Note**: This is a production-ready application. Ensure all environment variables are properly configured before deployment.

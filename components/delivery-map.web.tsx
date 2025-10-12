import { Styles } from "@/types/styles";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

export default function DeliveryMapWeb() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const [activeTab, setActiveTab] = useState<"install" | "features">("install");

  const openExpoGo = (platform: "ios" | "android") => {
    if (platform === "ios") {
      Linking.openURL("https://apps.apple.com/app/expo-go/id982107779");
    } else {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=host.exp.exponent"
      );
    }
  };

  const containerPadding = isMobile ? 16 : isTablet ? 32 : 48;
  const maxWidth = isMobile ? "100%" : isTablet ? 720 : 1200;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: containerPadding, paddingBottom: 40 }}
    >
      <View style={{ maxWidth, width: "100%", alignSelf: "center" }}>
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Text style={styles.heroIcon}>🚚</Text>
          </View>
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
            Courier App
          </Text>
          <Text
            style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}
          >
            Professional tool for couriers
          </Text>
          <View style={styles.heroBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📱 iOS</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🤖 Android</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>💾 Offline</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "install" && styles.tabActive]}
            onPress={() => setActiveTab("install")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "install" && styles.tabTextActive
              ]}
            >
              📲 Installation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "features" && styles.tabActive]}
            onPress={() => setActiveTab("features")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "features" && styles.tabTextActive
              ]}
            >
              ✨ Features
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "install" ? (
          <>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerIcon}>ℹ️</Text>
              <View style={styles.infoBannerContent}>
                <Text style={styles.infoBannerTitle}>Mobile app</Text>
                <Text style={styles.infoBannerText}>
                  Full functionality available only on mobile devices
                  (iOS/Android)
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  isMobile && styles.sectionTitleMobile
                ]}
              >
                How to install?
              </Text>

              <View style={[styles.step, isMobile && styles.stepMobile]}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  {!isMobile && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepTitle}>Download Expo Go</Text>
                  <Text style={styles.stepDescription}>
                    Install the free Expo Go app from your app store
                  </Text>
                  <View
                    style={[
                      styles.storeButtons,
                      isMobile && styles.storeButtonsMobile
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.storeButton, styles.storeButtonIos]}
                      onPress={() => openExpoGo("ios")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.storeButtonIcon}>🍎</Text>
                      <View>
                        <Text style={styles.storeButtonLabel}>Download on</Text>
                        <Text style={styles.storeButtonName}>App Store</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.storeButton, styles.storeButtonAndroid]}
                      onPress={() => openExpoGo("android")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.storeButtonIcon}>🤖</Text>
                      <View>
                        <Text style={styles.storeButtonLabel}>Get it on</Text>
                        <Text style={styles.storeButtonName}>Google Play</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.step, isMobile && styles.stepMobile]}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  {!isMobile && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepTitle}>Start development server</Text>
                  <Text style={styles.stepDescription}>
                    In terminal, in the project directory, run:
                  </Text>
                  <View style={styles.codeBlock}>
                    <View style={styles.codeHeader}>
                      <Text style={styles.codeHeaderText}>Terminal</Text>
                    </View>
                    <View style={styles.codeContent}>
                      <Text style={styles.codeText}>npm start</Text>
                    </View>
                  </View>
                  <Text style={styles.stepNote}>
                    💡 Make sure your phone and computer are on the same Wi-Fi
                    network
                  </Text>
                </View>
              </View>

              <View style={[styles.step, isMobile && styles.stepMobile]}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  {!isMobile && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepTitle}>Scan QR code</Text>
                  <Text style={styles.stepDescription}>
                    Open Expo Go and scan the displayed QR code
                  </Text>
                  <View style={styles.qrInstructions}>
                    <View style={styles.qrInstruction}>
                      <Text style={styles.qrInstructionIcon}>📱</Text>
                      <View style={styles.qrInstructionContent}>
                        <Text style={styles.qrInstructionTitle}>iOS</Text>
                        <Text style={styles.qrInstructionText}>
                          Use the built-in camera or open Expo Go
                        </Text>
                      </View>
                    </View>
                    <View style={styles.qrInstruction}>
                      <Text style={styles.qrInstructionIcon}>📱</Text>
                      <View style={styles.qrInstructionContent}>
                        <Text style={styles.qrInstructionTitle}>Android</Text>
                        <Text style={styles.qrInstructionText}>
                          Open Expo Go and tap &ldquo;Scan QR Code&rdquo;
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.step,
                  isMobile && styles.stepMobile,
                  { marginBottom: 0 }
                ]}
              >
                <View style={styles.stepLeft}>
                  <View style={[styles.stepNumber, styles.stepNumberSuccess]}>
                    <Text style={styles.stepNumberText}>✓</Text>
                  </View>
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepTitle}>Done!</Text>
                  <Text style={styles.stepDescription}>
                    The app will launch automatically on your phone
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.alternativeSection}>
              <Text style={styles.alternativeTitle}>🔧 For developers</Text>
              <Text style={styles.alternativeText}>
                You can also run the app on an emulator:
              </Text>
              <View style={styles.codeBlock}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeHeaderText}>Terminal</Text>
                </View>
                <View style={styles.codeContent}>
                  <Text style={styles.codeText}>npm run ios</Text>
                  <Text style={styles.codeComment}># lub</Text>
                  <Text style={styles.codeText}>npm run android</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  isMobile && styles.sectionTitleMobile
                ]}
              >
                Main features
              </Text>

              <View
                style={[
                  styles.featuresGrid,
                  isMobile && styles.featuresGridMobile
                ]}
              >
                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>🗺️</Text>
                  </View>
                  <Text style={styles.featureTitle}>Interactive map</Text>
                  <Text style={styles.featureDescription}>
                    Visualization of all delivery points on the map with
                    color-coded markers by status
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>🧭</Text>
                  </View>
                  <Text style={styles.featureTitle}>GPS navigation</Text>
                  <Text style={styles.featureDescription}>
                    Automatic navigation launch to selected point in Apple Maps
                    or Google Maps
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>📦</Text>
                  </View>
                  <Text style={styles.featureTitle}>Package details</Text>
                  <Text style={styles.featureDescription}>
                    Complete information about package, recipient and special
                    delivery instructions
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>🔊</Text>
                  </View>
                  <Text style={styles.featureTitle}>Voice readout</Text>
                  <Text style={styles.featureDescription}>
                    Text-to-speech synthesis - listen to delivery information
                    without looking at the screen
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>✅</Text>
                  </View>
                  <Text style={styles.featureTitle}>Delivery confirmation</Text>
                  <Text style={styles.featureDescription}>
                    Quick confirmation or rejection of delivery with optional
                    note
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    isMobile && styles.featureCardMobile
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <Text style={styles.featureIconLarge}>💾</Text>
                  </View>
                  <Text style={styles.featureTitle}>Offline mode</Text>
                  <Text style={styles.featureDescription}>
                    Work without internet - data syncs automatically when
                    connected
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.techSection}>
              <Text style={styles.techTitle}>⚙️ Technology</Text>
              <View style={styles.techGrid}>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Framework</Text>
                  <Text style={styles.techValue}>React Native + Expo</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Language</Text>
                  <Text style={styles.techValue}>TypeScript</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Maps</Text>
                  <Text style={styles.techValue}>react-native-maps</Text>
                </View>
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Storage</Text>
                  <Text style={styles.techValue}>AsyncStorage</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📖 Documentation available in README.md file
          </Text>
          <Text style={styles.footerCopyright}>© 2025 Courier App</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  hero: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20
  },
  heroIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  heroIcon: {
    fontSize: 64
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center"
  },
  heroTitleMobile: {
    fontSize: 36
  },
  heroSubtitle: {
    fontSize: 20,
    color: "#6c757d",
    marginBottom: 24,
    textAlign: "center"
  },
  heroSubtitleMobile: {
    fontSize: 16
  },
  heroBadges: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center"
  },
  badge: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0"
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a"
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center"
  },
  tabActive: {
    backgroundColor: "#2196F3"
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d"
  },
  tabTextActive: {
    color: "#fff"
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    alignItems: "center"
  },
  infoBannerIcon: {
    fontSize: 32,
    marginRight: 16
  },
  infoBannerContent: {
    flex: 1
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1565c0",
    marginBottom: 4
  },
  infoBannerText: {
    fontSize: 14,
    color: "#1976d2",
    lineHeight: 20
  },
  section: {
    marginBottom: 48
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 32
  },
  sectionTitleMobile: {
    fontSize: 24
  },
  step: {
    flexDirection: "row",
    marginBottom: 32
  },
  stepMobile: {
    flexDirection: "column"
  },
  stepLeft: {
    alignItems: "center",
    marginRight: 24,
    minWidth: 40
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  stepNumberSuccess: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50"
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 8
  },
  stepRight: {
    flex: 1
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8
  },
  stepDescription: {
    fontSize: 16,
    color: "#6c757d",
    lineHeight: 24,
    marginBottom: 16
  },
  stepNote: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 22,
    marginTop: 12,
    fontStyle: "italic"
  },
  storeButtons: {
    flexDirection: "row",
    gap: 16
  },
  storeButtonsMobile: {
    flexDirection: "column"
  },
  storeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  storeButtonIos: {
    backgroundColor: "#000"
  },
  storeButtonAndroid: {
    backgroundColor: "#01875f"
  },
  storeButtonIcon: {
    fontSize: 32,
    marginRight: 12
  },
  storeButtonLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2
  },
  storeButtonName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff"
  },
  codeBlock: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  codeHeader: {
    backgroundColor: "#2d2d2d",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  codeHeaderText: {
    color: "#e0e0e0",
    fontSize: 12,
    fontWeight: "600"
  },
  codeContent: {
    backgroundColor: "#1e1e1e",
    padding: 20
  },
  codeText: {
    fontFamily: "monospace",
    color: "#4ec9b0",
    fontSize: 16,
    lineHeight: 24
  },
  codeComment: {
    fontFamily: "monospace",
    color: "#6a9955",
    fontSize: 16,
    marginVertical: 4
  },
  qrInstructions: {
    gap: 12
  },
  qrInstruction: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  qrInstructionIcon: {
    fontSize: 32,
    marginRight: 16
  },
  qrInstructionContent: {
    flex: 1
  },
  qrInstructionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4
  },
  qrInstructionText: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20
  },
  alternativeSection: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  alternativeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12
  },
  alternativeText: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 24
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20
  },
  featuresGridMobile: {
    gap: 16
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 16,
    flex: 1,
    flexBasis: "33.333%",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  featureCardMobile: {
    width: "100%",
    minWidth: 0
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  featureIconLarge: {
    fontSize: 36
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12
  },
  featureDescription: {
    fontSize: 15,
    color: "#6c757d",
    lineHeight: 24
  },
  techSection: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  techTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20
  },
  techItem: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12
  },
  techLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600"
  },
  techValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600"
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0"
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 8
  },
  footerCopyright: {
    fontSize: 12,
    color: "#adb5bd",
    textAlign: "center"
  }
});

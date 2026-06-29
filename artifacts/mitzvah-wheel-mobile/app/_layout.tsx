import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MitzvahProvider } from "@/context/MitzvahContext";
import {
  loadNotificationPrefs,
  requestNotificationPermission,
  scheduleDailyNotification,
  setupNotificationHandler,
} from "@/hooks/useNotifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

if (Platform.OS !== "web") {
  setupNotificationHandler();
}

function RootLayoutNav() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web") return;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const mitzvah = response.notification.request.content.data?.mitzvah as string | undefined;
        if (mitzvah) {
          router.push({ pathname: "/(tabs)/", params: { highlight: mitzvah } } as never);
        }
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const mitzvah = response.notification.request.content.data?.mitzvah as string | undefined;
      if (mitzvah) {
        router.push({ pathname: "/(tabs)/", params: { highlight: mitzvah } } as never);
      }
    });

    loadNotificationPrefs().then((prefs) => {
      if (prefs.enabled) {
        scheduleDailyNotification(prefs.hour, prefs.minute);
      }
    });

    return () => subscription.remove();
  }, [router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
      requestNotificationPermission();
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <MitzvahProvider>
                <RootLayoutNav />
              </MitzvahProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

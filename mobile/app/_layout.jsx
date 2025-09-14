import { SplashScreen, useSegments, Slot, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuth();
  }, []);

  // handle navigation based on the auth state
  useEffect(() => {
    // Don't navigate until auth check is complete and fonts are loaded
    if (isCheckingAuth || !fontsLoaded) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    console.log("Navigation check:", {
      isSignedIn,
      inAuthScreen,
      user: !!user,
      token: !!token,
    });

    if (!isSignedIn && !inAuthScreen) {
      console.log("Redirecting to auth screen");
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      console.log("Redirecting to tabs screen");
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isCheckingAuth, fontsLoaded]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

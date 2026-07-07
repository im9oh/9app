import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StoreProvider } from '@/lib/store'
import { colors } from '@/theme'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.ink900 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

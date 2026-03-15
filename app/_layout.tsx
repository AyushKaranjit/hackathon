import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.secondary },
          headerTintColor: Colors.textOnDark,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="verify/select-type"
          options={{ title: 'Select Document', presentation: 'modal' }}
        />
        <Stack.Screen
          name="verify/capture"
          options={{ title: 'Scan Document', headerShown: false }}
        />
        <Stack.Screen
          name="verify/selfie"
          options={{ title: 'Take Selfie', headerShown: false }}
        />
        <Stack.Screen
          name="verify/processing"
          options={{ title: 'Analyzing', headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="verify/results"
          options={{ title: 'Results', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}

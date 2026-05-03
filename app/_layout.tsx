import React from 'react';
import { Stack } from 'expo-router';
import { ThemeContextProvider } from '../src/hooks/useTheme';

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </ThemeContextProvider>
  );
}

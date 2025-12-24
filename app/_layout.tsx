import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import '../global.css';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      AsyncStorage.clear();
    }
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(value === 'true');
      setReady(true);
    };
    checkOnboarding();
  }, []);

  if (!ready) {
    return <View className="flex-1 bg-white dark:bg-black" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!hasOnboarded && <Stack.Screen name="onboarding" />}

      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-habit"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

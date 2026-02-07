import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppTour, { tourTargets } from '../../components/AppTour';

export default function TabLayout() {
  useEffect(() => {
    return () => {
      tourTargets.tabBar = null;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0A0A0A',
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="map" color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="stats-chart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
          }}
        />
      </Tabs>
      {/* Invisible View at the bottom to measure tab bar position */}
      <View
        ref={(el) => {
          tourTargets.tabBar = el;
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 83,
        }}
        pointerEvents="none"
      />
      <AppTour />
    </View>
  );
}

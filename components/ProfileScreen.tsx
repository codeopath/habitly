import { View, Text, ScrollView, Switch, Pressable, Alert, Modal } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { cacheDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useIdentitiesContext } from '../context/IdentitiesContext';
import { useRevenueCat } from '../context/RevenueCatContext';
import { Timing } from '../model/types';
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
  scheduleHabitNotifications,
  getNotificationTimings,
  setNotificationTimings,
} from '../utils/notifications';

const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 5 AM to 11 PM

function formatHour(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:00 ${suffix}`;
}

export default function ProfileScreen() {
  const { identities } = useIdentitiesContext();
  const { isProUser, showPaywall, showCustomerCenter, restorePurchases } = useRevenueCat();
  const { habitCount, daysActive } = useMemo(() => {
    const allLogs: { date: string }[] = [];
    let habits = 0;

    for (const identity of identities) {
      habits += identity.habits.length;
      for (const habit of identity.habits) {
        for (const log of habit.logs ?? []) {
          allLogs.push(log);
        }
      }
    }

    const uniqueDays = new Set(allLogs.map((l) => l.date));

    return { habitCount: habits, daysActive: uniqueDays.size };
  }, [identities]);

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [timings, setTimings] = useState<Record<Timing, number> | null>(null);
  const [editingTiming, setEditingTiming] = useState<Timing | null>(null);

  useEffect(() => {
    getNotificationsEnabled().then(setNotificationsOn);
    getNotificationTimings().then(setTimings);
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsOn(value);
    await setNotificationsEnabled(value);
    if (value) {
      await scheduleHabitNotifications(identities);
    }
  };

  const updateTimingHour = async (timing: Timing, hour: number) => {
    const updated = { ...timings!, [timing]: hour };
    setTimings(updated);
    await setNotificationTimings(updated);
    await scheduleHabitNotifications(identities);
    setEditingTiming(null);
  };

  const handleExportData = async () => {
    try {
      const json = JSON.stringify(identities, null, 2);
      const date = new Date().toISOString().slice(0, 10);
      const path = `${cacheDirectory}habitly-export-${date}.json`;
      await writeAsStringAsync(path, json);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, { mimeType: 'application/json' });
      } else {
        Alert.alert('Export Ready', 'Sharing is not available on this device.');
      }
    } catch {
      Alert.alert('Error', 'Could not export data. Please try again.');
    }
  };

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      <Text className="mb-6 text-2xl font-extrabold tracking-wide text-white">PROFILE</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary row */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{identities.length}</Text>
            <Text className="text-xs text-neutral-400">Identities</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{habitCount}</Text>
            <Text className="text-xs text-neutral-400">Habits</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{daysActive}</Text>
            <Text className="text-xs text-neutral-400">Days Active</Text>
          </View>
        </View>

        {/* Identities list */}
        <Text className="mb-3 text-sm font-semibold text-neutral-400">YOUR IDENTITIES</Text>
        {identities.length === 0 ? (
          <View className="items-center rounded-2xl bg-neutral-800 px-4 py-8">
            <Text className="mb-2 text-3xl">👤</Text>
            <Text className="text-sm text-neutral-400">No identities yet</Text>
          </View>
        ) : (
          identities.map((identity) => (
            <View
              key={identity.id}
              className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
              <Text className="mr-3 text-xl">{identity.icon ?? '🙂'}</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">{identity.label}</Text>
                <Text className="text-xs text-neutral-400">
                  {identity.habits.length} habit{identity.habits.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Settings section */}
        <Text className="mb-3 mt-6 text-sm font-semibold text-neutral-400">SETTINGS</Text>

        {/* Notifications toggle */}
        <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-neutral-800 px-4 py-4">
          <Text className="text-base font-semibold text-white">Notifications</Text>
          <Switch
            value={notificationsOn}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#404040', true: '#3B82F6' }}
            thumbColor="#fff"
          />
        </View>

        {/* Notification timing customization */}
        {notificationsOn && timings && (
          <View className="mb-3 rounded-2xl bg-neutral-800 px-4 py-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-neutral-400">NOTIFICATION TIMES</Text>
              {!isProUser && <Text className="text-xs font-bold text-amber-400">PRO</Text>}
            </View>
            {Object.values(Timing).map((t) => (
              <Pressable
                key={t}
                onPress={async () => {
                  if (!isProUser) {
                    await showPaywall();
                    return;
                  }
                  setEditingTiming(t);
                }}
                className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-white">{t}</Text>
                <Text className="text-sm text-blue-500">{formatHour(timings[t])}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Data export */}
        <Pressable
          onPress={async () => {
            if (!isProUser) {
              await showPaywall();
              return;
            }
            await handleExportData();
          }}
          className="mb-3 rounded-2xl bg-neutral-800 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-white">Export Data</Text>
            {!isProUser && <Text className="text-xs font-bold text-amber-400">PRO</Text>}
          </View>
          <Text className="text-xs text-neutral-400">Download your habit data as JSON</Text>
        </Pressable>

        {/* Subscription section */}
        <Text className="mb-3 mt-6 text-sm font-semibold text-neutral-400">SUBSCRIPTION</Text>
        {isProUser ? (
          <View className="rounded-2xl bg-neutral-800 px-4 py-4">
            <View className="mb-3 flex-row items-center">
              <Text className="mr-2 text-lg">&#x2B50;</Text>
              <Text className="text-base font-semibold text-white">Habitly Pro</Text>
            </View>
            <Pressable onPress={showCustomerCenter} className="rounded-full bg-neutral-700 py-3">
              <Text className="text-center text-sm font-semibold text-white">
                Manage Subscription
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={showPaywall} className="rounded-2xl bg-blue-500 px-4 py-5">
            <Text className="text-center text-lg font-bold text-white">Upgrade to Pro</Text>
            <Text className="mt-1 text-center text-sm text-blue-100">
              Unlock all features and unlimited habits
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={async () => {
            try {
              await restorePurchases();
              Alert.alert('Purchases Restored', 'Your purchases have been restored successfully.');
            } catch {
              Alert.alert('Error', 'Could not restore purchases. Please try again.');
            }
          }}
          className="mb-2 mt-3">
          <Text className="text-center text-sm text-neutral-400">Restore Purchases</Text>
        </Pressable>

        {/* About section */}
        <Text className="mb-3 mt-6 text-sm font-semibold text-neutral-400">ABOUT</Text>
        <View className="rounded-2xl bg-neutral-800 px-4 py-4">
          <Text className="text-base font-semibold text-white">Habitly</Text>
          <Text className="text-sm text-neutral-400">Version {appVersion}</Text>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Hour picker modal */}
      <Modal
        visible={editingTiming !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingTiming(null)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setEditingTiming(null)} />

        <View className="rounded-t-3xl bg-neutral-900 px-6 py-6">
          <Text className="mb-4 text-center text-lg font-bold text-white">
            {editingTiming} Notification Time
          </Text>

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {HOURS.map((h) => {
              const isActive = editingTiming && timings ? timings[editingTiming] === h : false;

              return (
                <Pressable
                  key={h}
                  onPress={() => editingTiming && updateTimingHour(editingTiming, h)}
                  className={`mb-2 rounded-xl px-4 py-3 ${isActive ? 'bg-blue-500' : 'bg-neutral-800'}`}>
                  <Text
                    className={`text-center text-base ${isActive ? 'font-bold text-white' : 'text-neutral-300'}`}>
                    {formatHour(h)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable onPress={() => setEditingTiming(null)} className="mt-4 py-3">
            <Text className="text-center text-neutral-400">Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

import { View, Text, ScrollView } from 'react-native';
import { useMemo } from 'react';
import Constants from 'expo-constants';
import { useIdentitiesContext } from '../context/IdentitiesContext';

export default function ProfileScreen() {
  const { identities } = useIdentitiesContext();

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

        {/* About section */}
        <Text className="mb-3 mt-6 text-sm font-semibold text-neutral-400">ABOUT</Text>
        <View className="rounded-2xl bg-neutral-800 px-4 py-4">
          <Text className="text-base font-semibold text-white">Habitly</Text>
          <Text className="text-sm text-neutral-400">Version {appVersion}</Text>
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}

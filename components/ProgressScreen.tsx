import { View, Text, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useIdentitiesContext } from '../context/IdentitiesContext';

export default function ProgressScreen() {
  const { identities } = useIdentitiesContext();

  const allHabits = useMemo(() => identities.flatMap((i) => i.habits), [identities]);

  const allLogs = useMemo(() => allHabits.flatMap((h) => h.logs ?? []), [allHabits]);

  const { weekData, currentStreak, totalCompletions, totalMinutes } = useMemo(() => {
    const today = new Date();
    const days: { label: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = allLogs.filter((l) => l.date === dateStr).length;
      days.push({ label: dayLabel, count });
    }

    // Current streak: consecutive days (going back from today) with at least 1 log
    const logDates = new Set(allLogs.map((l) => l.date));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (logDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return {
      weekData: days,
      currentStreak: streak,
      totalCompletions: allLogs.length,
      totalMinutes: allLogs.reduce((sum, l) => sum + (l.duration ?? 0), 0),
    };
  }, [allLogs]);

  const maxCount = useMemo(() => Math.max(...weekData.map((d) => d.count), 1), [weekData]);

  const habitBreakdowns = useMemo(() => {
    const today = new Date();
    const logDates = (logs: { date: string }[]) => new Set(logs.map((l) => l.date));

    return allHabits.map((h) => {
      const logs = h.logs ?? [];
      const dates = logDates(logs);

      // Individual streak
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (dates.has(d.toISOString().slice(0, 10))) {
          streak++;
        } else {
          break;
        }
      }

      // Completion rate: days with log / days since first log
      const firstLog =
        logs.length > 0
          ? logs.reduce((min, l) => (l.date < min ? l.date : min), logs[0].date)
          : null;
      let rate = 0;
      if (firstLog) {
        const daysSinceFirst = Math.max(
          1,
          Math.floor((today.getTime() - new Date(firstLog).getTime()) / 86400000) + 1
        );
        rate = Math.round((dates.size / daysSinceFirst) * 100);
      }

      return { id: h.id, icon: h.icon, label: h.label, streak, rate, completions: logs.length };
    });
  }, [allHabits]);

  if (allLogs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950 px-5">
        <Text className="mb-2 text-5xl">📊</Text>
        <Text className="mb-2 text-lg font-semibold text-white">No progress yet</Text>
        <Text className="text-center text-sm text-neutral-400">
          Complete your first habit to see your stats here
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      <Text className="mb-6 text-2xl font-extrabold tracking-wide text-white">PROGRESS</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weekly bar chart */}
        <View className="mb-6 rounded-2xl bg-neutral-800 p-4">
          <Text className="mb-4 text-sm font-semibold text-neutral-400">LAST 7 DAYS</Text>
          <View className="flex-row items-end justify-between" style={{ height: 120 }}>
            {weekData.map((day, i) => (
              <View key={i} className="items-center" style={{ flex: 1 }}>
                <View
                  className="mb-2 w-8 rounded-md bg-blue-500"
                  style={{ height: Math.max(4, (day.count / maxCount) * 100) }}
                />
                <Text className="text-xs text-neutral-400">{day.label}</Text>
                <Text className="text-xs text-neutral-500">{day.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{currentStreak}</Text>
            <Text className="text-xs text-neutral-400">Day Streak</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{totalCompletions}</Text>
            <Text className="text-xs text-neutral-400">Completions</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{totalMinutes}</Text>
            <Text className="text-xs text-neutral-400">Minutes</Text>
          </View>
        </View>

        {/* Per-habit breakdown */}
        <Text className="mb-3 text-sm font-semibold text-neutral-400">PER HABIT</Text>
        {habitBreakdowns.map((h) => (
          <View
            key={h.id}
            className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-3 text-xl">{h.icon ?? '🙂'}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white" numberOfLines={1}>
                {h.label}
              </Text>
              <Text className="text-xs text-neutral-400">
                {h.streak} day streak · {h.completions} total
              </Text>
            </View>
            <Text className="text-sm font-semibold text-blue-500">{h.rate}%</Text>
          </View>
        ))}

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}

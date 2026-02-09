import { View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIdentitiesContext } from '../context/IdentitiesContext';
import { useRevenueCat } from '../context/RevenueCatContext';

/** Calculate streak — allowGrace enables 1 grace day (Pro feature) */
function calcStreak(
  logDates: Set<string>,
  allowGrace = true
): { streak: number; restDays: number } {
  const today = new Date();
  let streak = 0;
  let misses = 0;
  let restDays = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    if (logDates.has(dateStr)) {
      streak++;
      misses = 0;
    } else {
      misses++;
      if (!allowGrace || misses > 1) break;
      // Grace day — only count as rest if there are more active days after
      restDays++;
    }
  }

  // If the streak ends on a grace day, don't count that trailing rest day
  if (restDays > 0 && misses > 0) {
    restDays--;
  }

  return { streak, restDays };
}

const WEEKLY_SUMMARY_KEY = 'weeklySummaryDismissedDate';

function getMondayOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export default function ProgressScreen() {
  const { identities } = useIdentitiesContext();
  const { isProUser, showPaywall } = useRevenueCat();
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  const allHabits = useMemo(() => identities.flatMap((i) => i.habits), [identities]);

  const allLogs = useMemo(() => allHabits.flatMap((h) => h.logs ?? []), [allHabits]);

  // Check if weekly summary should show
  useEffect(() => {
    AsyncStorage.getItem(WEEKLY_SUMMARY_KEY).then((dismissed) => {
      const thisMonday = getMondayOfWeek(new Date());
      setShowWeeklySummary(dismissed !== thisMonday);
    });
  }, []);

  const dismissWeeklySummary = async () => {
    const thisMonday = getMondayOfWeek(new Date());
    await AsyncStorage.setItem(WEEKLY_SUMMARY_KEY, thisMonday);
    setShowWeeklySummary(false);
  };

  const { weekData, currentStreak, currentRestDays, totalCompletions, totalMinutes } =
    useMemo(() => {
      const today = new Date();
      const days: { label: string; count: number; date: string }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        const count = allLogs.filter((l) => l.date === dateStr).length;
        days.push({ label: dayLabel, count, date: dateStr });
      }

      const logDates = new Set(allLogs.map((l) => l.date));
      const { streak, restDays } = calcStreak(logDates, isProUser);

      return {
        weekData: days,
        currentStreak: streak,
        currentRestDays: restDays,
        totalCompletions: allLogs.length,
        totalMinutes: allLogs.reduce((sum, l) => sum + (l.duration ?? 0), 0),
      };
    }, [allLogs, isProUser]);

  // Weekly summary data (last 7 days)
  const weeklySummary = useMemo(() => {
    const totalForWeek = weekData.reduce((s, d) => s + d.count, 0);
    const possibleForWeek = allHabits.length * 7;
    const rate = possibleForWeek > 0 ? Math.round((totalForWeek / possibleForWeek) * 100) : 0;
    const bestDay = weekData.reduce((best, d) => (d.count > best.count ? d : best), weekData[0]);
    const totalMin = allLogs
      .filter((l) => weekData.some((d) => d.date === l.date))
      .reduce((s, l) => s + (l.duration ?? 0), 0);

    return { totalForWeek, rate, bestDay: bestDay?.label ?? '-', totalMin };
  }, [weekData, allHabits.length, allLogs]);

  const maxCount = useMemo(() => Math.max(...weekData.map((d) => d.count), 1), [weekData]);

  const habitBreakdowns = useMemo(() => {
    const today = new Date();
    const toDateSet = (logs: { date: string }[]) => new Set(logs.map((l) => l.date));

    return allHabits.map((h) => {
      const logs = h.logs ?? [];
      const dates = toDateSet(logs);
      const { streak, restDays } = calcStreak(dates, isProUser);

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

      return {
        id: h.id,
        icon: h.icon,
        label: h.label,
        streak,
        restDays,
        rate,
        completions: logs.length,
      };
    });
  }, [allHabits, isProUser]);

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
        {/* Weekly summary card */}
        {showWeeklySummary &&
          (isProUser ? (
            <View className="mb-6 rounded-2xl bg-blue-500/10 p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-blue-400">WEEKLY SUMMARY</Text>
                <Pressable onPress={dismissWeeklySummary}>
                  <Text className="text-sm text-neutral-400">Dismiss</Text>
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 items-center rounded-xl bg-neutral-800 py-3">
                  <Text className="text-xl font-bold text-blue-500">
                    {weeklySummary.totalForWeek}
                  </Text>
                  <Text className="text-xs text-neutral-400">Completions</Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-neutral-800 py-3">
                  <Text className="text-xl font-bold text-blue-500">{weeklySummary.rate}%</Text>
                  <Text className="text-xs text-neutral-400">Rate</Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-neutral-800 py-3">
                  <Text className="text-xl font-bold text-blue-500">{weeklySummary.totalMin}</Text>
                  <Text className="text-xs text-neutral-400">Minutes</Text>
                </View>
              </View>

              <Text className="mt-3 text-center text-xs text-neutral-400">
                Best day: {weeklySummary.bestDay}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={showPaywall}
              className="mb-6 items-center rounded-2xl bg-blue-500/10 p-4">
              <View className="mb-2 flex-row items-center">
                <Text className="mr-2 text-sm font-semibold text-blue-400">WEEKLY SUMMARY</Text>
                <Text className="text-xs font-bold text-amber-400">PRO</Text>
              </View>
              <Text className="text-sm text-neutral-400">
                Upgrade to Pro to see your weekly insights
              </Text>
            </Pressable>
          ))}

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
          <Pressable
            onPress={!isProUser ? showPaywall : undefined}
            className="flex-1 items-center rounded-2xl bg-neutral-800 py-4">
            <Text className="text-2xl font-bold text-blue-500">{currentStreak}</Text>
            <Text className="text-xs text-neutral-400">
              Day Streak{currentRestDays > 0 ? ` (${currentRestDays} rest)` : ''}
            </Text>
            {!isProUser && (
              <Text className="mt-1 text-xs font-bold text-amber-400">PRO rest days</Text>
            )}
          </Pressable>
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
                {h.streak} day streak{h.restDays > 0 ? ` (${h.restDays} rest)` : ''} ·{' '}
                {h.completions} total
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

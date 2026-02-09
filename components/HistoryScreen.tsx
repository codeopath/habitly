import { View, Text, Pressable, ScrollView } from 'react-native';
import { useMemo, useState } from 'react';
import { useIdentitiesContext } from '../context/IdentitiesContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-neutral-800';
  if (count === 1) return 'bg-green-900';
  if (count === 2) return 'bg-green-700';
  return 'bg-green-500';
}

export default function HistoryScreen() {
  const { identities } = useIdentitiesContext();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Collect all logs with habit info
  const allLogs = useMemo(() => {
    const logs: { date: string; duration: number; habitLabel: string; habitIcon: string }[] = [];
    for (const identity of identities) {
      for (const habit of identity.habits) {
        for (const log of habit.logs ?? []) {
          logs.push({
            date: log.date,
            duration: log.duration,
            habitLabel: habit.label,
            habitIcon: habit.icon ?? '🙂',
          });
        }
      }
    }
    return logs;
  }, [identities]);

  // Count logs per date
  const logCountByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of allLogs) {
      map.set(log.date, (map.get(log.date) ?? 0) + 1);
    }
    return map;
  }, [allLogs]);

  // Current month info
  const { year, month, monthLabel, daysInMonth, startDayOfWeek, totalForMonth } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = target.getFullYear();
    const m = target.getMonth();
    const daysCount = new Date(y, m + 1, 0).getDate();
    const startDay = target.getDay();
    const label = target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    let total = 0;
    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      total += logCountByDate.get(dateStr) ?? 0;
    }

    return { year: y, month: m, monthLabel: label, daysInMonth: daysCount, startDayOfWeek: startDay, totalForMonth: total };
  }, [monthOffset, logCountByDate]);

  // Build calendar grid cells
  const calendarCells = useMemo(() => {
    const cells: { date: string | null; day: number | null; count: number }[] = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ date: null, day: null, count: 0 });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ date: dateStr, day: d, count: logCountByDate.get(dateStr) ?? 0 });
    }

    return cells;
  }, [year, month, daysInMonth, startDayOfWeek, logCountByDate]);

  // Logs for selected date
  const selectedLogs = useMemo(() => {
    if (!selectedDate) return [];
    return allLogs.filter((l) => l.date === selectedDate);
  }, [selectedDate, allLogs]);

  const today = new Date().toISOString().slice(0, 10);
  const canGoForward = monthOffset < 0;

  if (allLogs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950 px-5">
        <Text className="mb-2 text-5xl">📅</Text>
        <Text className="mb-2 text-lg font-semibold text-white">No history yet</Text>
        <Text className="text-center text-sm text-neutral-400">
          Your completed habits will appear here
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-950 px-5 pt-14">
      <Text className="mb-6 text-2xl font-extrabold tracking-wide text-white">HISTORY</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month navigation */}
        <View className="mb-2 flex-row items-center justify-between">
          <Pressable onPress={() => setMonthOffset((o) => o - 1)} className="px-3 py-2">
            <Text className="text-xl text-white">←</Text>
          </Pressable>

          <View className="items-center">
            <Text className="text-lg font-bold text-white">{monthLabel}</Text>
            <Text className="text-xs text-neutral-400">{totalForMonth} completions</Text>
          </View>

          <Pressable
            onPress={() => canGoForward && setMonthOffset((o) => o + 1)}
            className="px-3 py-2"
            disabled={!canGoForward}>
            <Text className={`text-xl ${canGoForward ? 'text-white' : 'text-neutral-700'}`}>→</Text>
          </Pressable>
        </View>

        {/* Day-of-week headers */}
        <View className="mb-2 flex-row">
          {DAY_LABELS.map((d) => (
            <View key={d} className="flex-1 items-center">
              <Text className="text-xs text-neutral-500">{d}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="mb-4 flex-row flex-wrap">
          {calendarCells.map((cell, i) => {
            const isToday = cell.date === today;
            const isSelected = cell.date === selectedDate;

            return (
              <View key={i} className="items-center p-1" style={{ width: '14.28%' }}>
                {cell.date ? (
                  <Pressable
                    onPress={() => setSelectedDate(cell.date === selectedDate ? null : cell.date)}
                    className={`h-10 w-10 items-center justify-center rounded-lg ${getIntensityClass(cell.count)} ${
                      isSelected ? 'border-2 border-blue-500' : ''
                    } ${isToday ? 'border border-neutral-500' : ''}`}>
                    <Text
                      className={`text-xs font-semibold ${
                        cell.count > 0 ? 'text-white' : 'text-neutral-500'
                      }`}>
                      {cell.day}
                    </Text>
                  </Pressable>
                ) : (
                  <View className="h-10 w-10" />
                )}
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View className="mb-6 flex-row items-center justify-center gap-3">
          <View className="flex-row items-center">
            <View className="mr-1 h-3 w-3 rounded bg-neutral-800" />
            <Text className="text-xs text-neutral-500">None</Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-1 h-3 w-3 rounded bg-green-900" />
            <Text className="text-xs text-neutral-500">1</Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-1 h-3 w-3 rounded bg-green-700" />
            <Text className="text-xs text-neutral-500">2</Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-1 h-3 w-3 rounded bg-green-500" />
            <Text className="text-xs text-neutral-500">3+</Text>
          </View>
        </View>

        {/* Selected day detail */}
        {selectedDate && (
          <View className="mb-6">
            <Text className="mb-3 text-sm font-semibold text-neutral-400">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>

            {selectedLogs.length === 0 ? (
              <View className="items-center rounded-2xl bg-neutral-800 px-4 py-6">
                <Text className="text-sm text-neutral-400">No habits completed this day</Text>
              </View>
            ) : (
              selectedLogs.map((log, i) => (
                <View
                  key={i}
                  className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
                  <Text className="mr-3 text-xl">{log.habitIcon}</Text>
                  <Text className="flex-1 text-base font-semibold text-white" numberOfLines={1}>
                    {log.habitLabel}
                  </Text>
                  <Text className="text-sm text-neutral-400">{log.duration} min</Text>
                </View>
              ))
            )}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}

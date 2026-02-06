import { View, Text, SectionList } from 'react-native';
import { useMemo } from 'react';
import { useIdentitiesContext } from '../context/IdentitiesContext';

export default function HistoryScreen() {
  const { identities } = useIdentitiesContext();

  const sections = useMemo(() => {
    const habitMap = new Map<string, { label: string; icon: string }>();
    const allLogs: { date: string; duration: number; habitId: string }[] = [];

    for (const identity of identities) {
      for (const habit of identity.habits) {
        habitMap.set(habit.id, { label: habit.label, icon: habit.icon });
        for (const log of habit.logs ?? []) {
          allLogs.push({ date: log.date, duration: log.duration, habitId: habit.id });
        }
      }
    }

    // Group by date descending
    const grouped = new Map<string, typeof allLogs>();
    for (const log of allLogs) {
      const existing = grouped.get(log.date) ?? [];
      existing.push(log);
      grouped.set(log.date, existing);
    }

    const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    return {
      sections: sortedDates.map((date) => {
        let title = date;
        if (date === today) title = 'Today';
        else if (date === yesterday) title = 'Yesterday';
        else {
          const d = new Date(date + 'T00:00:00');
          title = d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          });
        }

        return {
          title,
          data: (grouped.get(date) ?? []).map((log) => ({
            ...log,
            habit: habitMap.get(log.habitId) ?? { label: 'Unknown', icon: '❓' },
          })),
        };
      }),
    };
  }, [identities]);

  if (sections.sections.length === 0) {
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

      <SectionList
        sections={sections.sections}
        keyExtractor={(item, index) => `${item.habitId}-${item.date}-${index}`}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-3 mt-4 text-sm font-semibold text-neutral-400">{title}</Text>
        )}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-3 text-xl">{item.habit.icon}</Text>
            <Text className="flex-1 text-base font-semibold text-white" numberOfLines={1}>
              {item.habit.label}
            </Text>
            <Text className="text-sm text-neutral-400">{item.duration} min</Text>
          </View>
        )}
        ListFooterComponent={<View className="h-24" />}
      />
    </View>
  );
}

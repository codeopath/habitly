import { View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import { Habit } from '../../model/types';
import HabitCard from '../../components/HabitCard';

export default function HomeScreen() {
  const identity = 'I am a reader';

  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'I read today', checkedToday: null, duration: 15 },
    { id: '2', title: 'I reflected on what I read', checkedToday: null, duration: 15 },
  ]);

  const handleCheck = (habitId: string, value: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, checkedToday: value } : h)));
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <View className="flex-1 bg-white px-5 pt-16 dark:bg-black">
      {/* Identity Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">{identity}</Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Showing up builds who you are.
        </Text>
      </View>

      {/* Today */}
      <Text className="mb-4 text-xs text-gray-400 dark:text-gray-500">Today • {today}</Text>

      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard habit={item} onCheck={(value) => handleCheck(item.id, value)} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

import { View, Text, Pressable, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { UserHabit } from '../model/types';

export default function HabitRow({ habit, onPress }: { habit: UserHabit; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (habit.checkedToday) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [habit.checkedToday, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        className={`mb-3 flex-row items-center rounded-2xl px-4 py-4 ${
          habit.checkedToday ? 'bg-green-600' : 'bg-neutral-800'
        }`}>
        {/* Status indicator */}
        <View
          className={`mr-4 h-6 w-6 rounded-full border ${
            habit.checkedToday ? 'border-green-300 bg-green-300' : 'border-neutral-600'
          }`}
        />

        {/* Icon */}
        <Text className="mr-3 text-xl">{habit.icon ?? '🙂'}</Text>

        {/* Title */}
        <Text
          className={`flex-1 text-base font-semibold ${
            habit.checkedToday ? 'text-white' : 'text-neutral-200'
          }`}
          numberOfLines={1}>
          {habit.label}
        </Text>

        {/* Duration */}
        <Text
          className={`mr-3 text-sm ${habit.checkedToday ? 'text-white/90' : 'text-neutral-400'}`}>
          {habit.duration} min
        </Text>

        {/* Menu */}
        <Text className="text-xl text-white/70">⋯</Text>
      </Pressable>
    </Animated.View>
  );
}

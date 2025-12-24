import { View, Text, Pressable } from 'react-native';
import { UserHabit } from '../model/types';

export default function HabitRow({
                                   habit,
                                   onToggle,
                                 }: {
  habit: UserHabit;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className={`mb-3 flex-row items-center rounded-2xl px-4 py-4 ${
        habit.checkedToday ? 'bg-blue-500' : 'bg-neutral-800'
      }`}
    >
      {/* Status indicator */}
      <View
        className={`mr-4 h-6 w-6 rounded-full border ${
          habit.checkedToday
            ? 'border-blue-300 bg-blue-300'
            : 'border-neutral-600'
        }`}
      />

      {/* Icon */}
      <Text className="mr-3 text-xl">
        {habit.icon ?? '🙂'}
      </Text>

      {/* Title */}
      <Text
        className={`flex-1 text-base font-semibold ${
          habit.checkedToday ? 'text-white' : 'text-neutral-200'
        }`}
        numberOfLines={1}
      >
        {habit.label}
      </Text>

      {/* Duration */}
      <Text
        className={`mr-3 text-sm ${
          habit.checkedToday ? 'text-white/90' : 'text-neutral-400'
        }`}
      >
        {habit.duration} min
      </Text>

      {/* Menu */}
      <Text className="text-xl text-neutral-400">⋯</Text>
    </Pressable>
  );
}

import { View, Text, Pressable } from 'react-native';
import { Habit } from '../model/types';

type Props = {
  habit: Habit;
  onLog: (duration: number) => void;
  onSkip: () => void;
};

const DURATIONS = [5, 10, 15, 30];

export default function HabitCard({ habit, onLog, onSkip }: Props) {
  return (
    <View className="mb-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-900">
      <Text className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
        {habit.label}
      </Text>

      {/* Not logged yet */}
      {habit.checkedToday === null && (
        <View className="flex-row flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <Pressable
              key={d}
              onPress={() => onLog(d)}
              className="rounded-lg bg-gray-900 px-4 py-2 dark:bg-gray-100">
              <Text className="font-semibold text-white dark:text-gray-900">{d} min</Text>
            </Pressable>
          ))}

          <Pressable onPress={onSkip} className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-800">
            <Text className="text-gray-700 dark:text-gray-300">Not today</Text>
          </Pressable>
        </View>
      )}

      {/* Logged */}
      {habit.checkedToday === true && (
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          ✓ You showed up for {habit.duration} minutes today.
        </Text>
      )}

      {/* Skipped */}
      {habit.checkedToday === false && (
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          That’s okay. Tomorrow is another chance.
        </Text>
      )}
    </View>
  );
}

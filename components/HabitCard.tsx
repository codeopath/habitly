import { View, Text, Pressable } from 'react-native';
import { Habit } from '../model/types';

type Props = {
  habit: Habit;
  onCheck: (value: boolean) => void;
};

export default function HabitCard({ habit, onCheck }: Props) {
  return (
    <View className="mb-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-900">
      <View className="flex flex-row flex-wrap items-center justify-between gap-2">
        <Text className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          {habit.title}
        </Text>
        <Text className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          {habit.duration} minutes
        </Text>
      </View>
      {habit.checkedToday === null ? (
        <View className="space-y-2">
          <Pressable
            onPress={() => onCheck(true)}
            className="items-center rounded-lg bg-gray-900 py-3 dark:bg-gray-100">
            <Text className="font-semibold text-white dark:text-gray-900">YES, I SHOWED UP</Text>
          </Pressable>

          <Pressable
            onPress={() => onCheck(false)}
            className="items-center rounded-lg bg-gray-200 py-3 dark:bg-gray-800">
            <Text className="text-gray-900 dark:text-gray-100">NOT TODAY</Text>
          </Pressable>
        </View>
      ) : (
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {habit.checkedToday
            ? '✓ You acted like this identity today.'
            : 'That’s okay. Tomorrow is another chance.'}
        </Text>
      )}
    </View>
  );
}

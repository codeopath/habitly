import { Text, View } from 'react-native';
import { Identity } from '../model/types';
import HabitCard from './HabitCard';

type Props = {
  identity: Identity;
  onHabitCheck: (identityId: string, habitId: string, duration: number) => void;
};

export default function IdentityCard({ identity, onHabitCheck }: Props) {
  return (
    <View className="mb-10">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {identity.label}
        </Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Showing up builds who you are.
        </Text>
      </View>

      {identity.habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onLog={(duration) => onHabitCheck(identity.id, habit.id, duration)}
          onSkip={() => onHabitCheck(identity.id, habit.id, 0)}
        />
      ))}
    </View>
  );
}

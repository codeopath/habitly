import { useRouter, useLocalSearchParams } from 'expo-router';
import AddHabitScreen from '../components/AddHabitScreen';
import { useIdentitiesContext } from '../context/IdentitiesContext';

export default function EditHabitRoute() {
  const router = useRouter();
  const { habitId, identityId } = useLocalSearchParams<{ habitId: string; identityId: string }>();
  const { identities, editHabit } = useIdentitiesContext();

  const identity = identities.find((i) => i.id === identityId);
  const habit = identity?.habits.find((h) => h.id === habitId);

  if (!habit) return null;

  return (
    <AddHabitScreen
      title="Edit Habit"
      initialLabel={habit.label}
      initialTiming={habit.timing}
      initialDuration={habit.duration}
      onCancel={() => router.back()}
      onSave={(updated) => {
        editHabit(habitId, {
          label: updated.label,
          timing: updated.timing,
          duration: updated.duration,
        });
        router.back();
      }}
    />
  );
}

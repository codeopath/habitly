import { useRouter } from 'expo-router';
import AddHabitScreen from '../components/AddHabitScreen';
import { useIdentities } from '../hooks/useIdentities';

export default function AddHabitRoute() {
  const router = useRouter();
  const { addHabit } = useIdentities();
  return (
    <AddHabitScreen
      onCancel={() => {
        router.replace('/');
      }}
      onSave={(habit) => {
        addHabit(habit);
        router.replace('/');
      }}
    />
  );
}

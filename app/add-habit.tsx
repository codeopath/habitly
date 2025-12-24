import { useRouter } from 'expo-router';
import AddHabitScreen from '../components/AddHabitScreen';
import { useIdentitiesContext } from '../context/IdentitiesContext';

export default function AddHabitRoute() {
  const router = useRouter();
  const { addHabit } = useIdentitiesContext();
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

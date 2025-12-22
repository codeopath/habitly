import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstHabitSelectionScreen from '../../components/FirstHabitSelectionScreen';

export default function HabitRoute() {
  const router = useRouter();
  const { target } = useLocalSearchParams<{ target: string }>();

  return (
    <FirstHabitSelectionScreen
      onSkip={async () => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        await AsyncStorage.setItem('target', target ?? '');
        router.replace('/(tabs)');
      }}
      onNext={async (habit) => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        await AsyncStorage.setItem('target', target ?? '');
        await AsyncStorage.setItem('firstHabit', habit);
        router.replace('/(tabs)');
      }}
    />
  );
}

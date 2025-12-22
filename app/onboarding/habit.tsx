import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstHabitSelectionScreen from '../../components/FirstHabitSelectionScreen';

export default function HabitRoute() {
  const router = useRouter();
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const parsedIdentity = identity ? JSON.parse(identity) : null;
  return (
    <FirstHabitSelectionScreen
      identity={parsedIdentity}
      onSkip={async () => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        await AsyncStorage.setItem('target', parsedIdentity.id ?? '');
        router.replace('/(tabs)');
      }}
      onNext={async (habit) => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        await AsyncStorage.setItem('target', parsedIdentity.id ?? '');
        await AsyncStorage.setItem('firstHabit', habit);
        router.replace('/(tabs)');
      }}
    />
  );
}

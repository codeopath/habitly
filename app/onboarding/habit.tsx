import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstHabitSelectionScreen from '../../components/FirstHabitSelectionScreen';
import { Identity } from '../../model/types';

export default function HabitRoute() {
  const router = useRouter();
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const parsedIdentity: Identity = identity ? JSON.parse(identity) : null;
  return (
    <FirstHabitSelectionScreen
      identity={parsedIdentity}
      onSkip={async () => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        await AsyncStorage.setItem('identities', JSON.stringify([parsedIdentity]));
        router.replace('/(tabs)');
      }}
      onNext={async (habit) => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        parsedIdentity.habits = [habit];
        await AsyncStorage.setItem('identities', JSON.stringify([parsedIdentity]));
        router.replace('/(tabs)');
      }}
    />
  );
}

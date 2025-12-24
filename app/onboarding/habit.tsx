import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstHabitSelectionScreen from '../../components/FirstHabitSelectionScreen';
import { Identity } from '../../model/types';
import { useIdentitiesContext } from '../../context/IdentitiesContext';

export default function HabitRoute() {
  const router = useRouter();
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const parsedIdentity: Identity = identity ? JSON.parse(identity) : null;
  const { addIdentity } = useIdentitiesContext();
  return (
    <FirstHabitSelectionScreen
      identity={parsedIdentity}
      onSkip={async () => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        addIdentity(parsedIdentity);
        router.replace('/(tabs)');
      }}
      onNext={async (habit) => {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        parsedIdentity.habits = [habit];
        addIdentity(parsedIdentity);
        router.replace('/(tabs)');
      }}
    />
  );
}

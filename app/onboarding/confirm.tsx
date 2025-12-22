import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingConfirmScreen from '../../components/OnboardingConfirmScreen';

export default function Confirm() {
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const router = useRouter();

  const finish = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    await AsyncStorage.setItem('identity', identity!);

    router.replace('/(tabs)');
  };

  return <OnboardingConfirmScreen identity={identity!} onFinish={finish} />;
}

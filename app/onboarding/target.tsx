import { useRouter } from 'expo-router';
import TargetSelectionScreen from '../../components/TargetSelectionScreen';

export default function TargetRoute() {
  const router = useRouter();

  return (
    <TargetSelectionScreen
      onBack={() => router.back()}
      onNext={(identity) => {
        router.push({
          pathname: '/onboarding/habit',
          params: {
            identity: identity ? JSON.stringify(identity) : '',
          },
        });
      }}
    />
  );
}

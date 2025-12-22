import { useRouter } from 'expo-router';
import TargetSelectionScreen from '../../components/TargetSelectionScreen';


export default function TargetRoute() {
  const router = useRouter();

  return (
    <TargetSelectionScreen
      onNext={(target) => {
        router.push({
          pathname: '/onboarding/habit',
          params: { target },
        });
      }}
    />
  );
}

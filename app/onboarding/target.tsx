import { useRouter } from 'expo-router';
import OnboardingIdentityScreen from '../../components/OnboardingIdentityScreen';

export default function OnboardingIndex() {
  const router = useRouter();

  return (
    <OnboardingIdentityScreen
      onNext={(identity) => {
        router.push({
          pathname: '/onboarding/confirm',
          params: { identity },
        });
      }}
    />
  );
}

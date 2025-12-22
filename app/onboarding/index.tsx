import { useRouter } from 'expo-router';
import OnboardingCarousel from '../../components/OnboardingCarousel';

export default function CarouselRoute() {
  const router = useRouter();

  return (
    <OnboardingCarousel
      onDone={() => {
        router.replace('/onboarding/target');
      }}
    />
  );
}

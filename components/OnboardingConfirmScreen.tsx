import { View, Text, Pressable } from 'react-native';

export default function OnboardingConfirmScreen({
  identity,
  onFinish,
}: {
  identity: string;
  onFinish: () => void;
}) {
  return (
    <View className="flex-1 bg-neutral-50 px-6 pt-28 dark:bg-black">
      {/* Identity */}
      <Text className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        {identity}
      </Text>

      {/* Affirmation */}
      <Text className="mt-6 max-w-sm text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
        You don’t become this overnight.
        <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
          {' '}
          You become it by showing up.
        </Text>
      </Text>

      {/* Spacer */}
      <View className="flex-1" />

      {/* CTA */}
      <Pressable
        onPress={onFinish}
        className="mb-6 rounded-2xl bg-neutral-900 py-4 shadow-lg dark:bg-neutral-100">
        <Text className="text-center text-base font-semibold text-white dark:text-neutral-900">
          Start showing up
        </Text>
      </Pressable>

      {/* Footer hint */}
      <Text className="mb-8 text-center text-xs tracking-wide text-neutral-400">
        You can change this anytime
      </Text>
    </View>
  );
}

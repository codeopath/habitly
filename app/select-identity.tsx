import { View, Text, Pressable, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useIdentitiesContext } from '../context/IdentitiesContext';
import { useRevenueCat } from '../context/RevenueCatContext';

export default function SelectIdentityRoute() {
  const router = useRouter();
  const { identities } = useIdentitiesContext();
  const { isProUser, showPaywall } = useRevenueCat();
  const FREE_HABIT_LIMIT = 5;
  const FREE_IDENTITY_LIMIT = 3;
  const totalHabits = useMemo(
    () => identities.reduce((sum, i) => sum + i.habits.length, 0),
    [identities]
  );

  return (
    <View className="flex-1 bg-neutral-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base text-neutral-400">Cancel</Text>
        </Pressable>

        <View className="items-center">
          <Text className="text-lg font-bold text-white">Select Identity</Text>
          {!isProUser && (
            <Text className="text-xs text-neutral-500">
              {totalHabits}/{FREE_HABIT_LIMIT} habits
            </Text>
          )}
        </View>

        <View className="w-12" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Identity list */}
        {identities.map((identity) => (
          <Pressable
            key={identity.id}
            onPress={async () => {
              if (!isProUser && totalHabits >= FREE_HABIT_LIMIT) {
                await showPaywall();
                return;
              }
              router.replace({
                pathname: '/add-habit',
                params: {
                  identity: identity.id,
                },
              });
            }}
            className="mb-4 flex-row items-center rounded-2xl bg-neutral-800 px-4 py-4">
            <Text className="mr-4 text-2xl">{identity.icon ?? '🙂'}</Text>

            <Text className="flex-1 text-base font-semibold text-white">{identity.label}</Text>

            <Text className="text-neutral-400">›</Text>
          </Pressable>
        ))}

        {/* Create new identity */}
        <Pressable
          onPress={async () => {
            if (!isProUser && identities.length >= FREE_IDENTITY_LIMIT) {
              await showPaywall();
              return;
            }
            router.replace('/add-identity');
          }}
          className="mt-4 flex-row items-center rounded-2xl border border-dashed border-neutral-600 px-4 py-4">
          <Text className="mr-4 text-xl">➕</Text>
          <Text className="text-base font-semibold text-neutral-300">Create new identity</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

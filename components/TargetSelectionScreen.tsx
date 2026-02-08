import { View, Text, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchIdentities } from '../api/identities';
import { Identity } from '../model/types';

export default function TargetSelectionScreen({
  onNext,
  onBack,
}: {
  onNext: (identity: Identity) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<Identity | null>(null);
  const [identities, setIdentities] = useState<Identity[]>([]);

  useEffect(() => {
    async function loadIdentities() {
      try {
        const data = await fetchIdentities();
        setIdentities(data);
      } catch (err) {
        console.error('Failed to fetch identities:', err);
      }
    }
    loadIdentities();
  }, []);
  return (
    <View className="flex-1 bg-neutral-900 px-6 pt-16">
      {/* Back button */}
      <Pressable onPress={onBack} className="mb-4 self-start">
        <Text className="text-2xl text-white">←</Text>
      </Pressable>

      {/* Progress bar */}
      <View className="mb-10 flex-row space-x-2">
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-neutral-700" />
      </View>

      <Text className="mt-2 text-sm text-neutral-400">Help us understand your needs better</Text>
      <Text className="text-3xl font-extrabold text-white">I want to...</Text>

      {/* Cards */}
      <ScrollView
        className="mt-8 flex-1"
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {identities.map((t) => {
          const isSelected = selected?.id === t.id;

          return (
            <Pressable
              key={t.id}
              onPress={() => setSelected(t)}
              className={`mb-4 w-[48%] rounded-2xl p-5 ${
                isSelected ? 'bg-blue-500' : 'bg-neutral-800'
              }`}>
              <Text className="mb-4 text-3xl">{t.icon}</Text>
              <Text className="text-lg font-semibold text-white">{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CTA */}
      <Pressable
        disabled={!selected}
        onPress={() => selected && onNext(selected)}
        className={`mb-8 mt-auto rounded-full py-4 ${selected ? 'bg-blue-500' : 'bg-neutral-700'}`}>
        <Text className="text-center text-lg font-bold text-white">NEXT</Text>
      </Pressable>
    </View>
  );
}

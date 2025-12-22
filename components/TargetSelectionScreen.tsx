import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

const TARGETS = [
  { id: 'health', label: 'Live healthier', icon: '❤️' },
  { id: 'stress', label: 'Relieve pressure', icon: '🧠' },
  { id: 'explore', label: 'Try new things', icon: '🌱' },
  { id: 'focus', label: 'Be more focused', icon: '🎯' },
  { id: 'relationships', label: 'Better relationship', icon: '👥' },
  { id: 'sleep', label: 'Sleep better', icon: '🌙' },
];

export default function TargetSelectionScreen({
                                                onNext,
                                              }: {
  onNext: (target: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-neutral-900 px-6 pt-16">
      {/* Progress bar */}
      <View className="mb-10 flex-row space-x-2">
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-neutral-700" />
      </View>

      <Text className="text-3xl font-extrabold text-white">
        What’s your target?
      </Text>
      <Text className="mt-2 text-sm text-neutral-400">
        Help us understand your needs better
      </Text>

      {/* Cards */}
      <View className="mt-8 flex-row flex-wrap justify-between">
        {TARGETS.map((t) => {
          const isSelected = selected === t.id;

          return (
            <Pressable
              key={t.id}
              onPress={() => setSelected(t.id)}
              className={`mb-4 w-[48%] rounded-2xl p-5 ${
                isSelected
                  ? 'bg-blue-500'
                  : 'bg-neutral-800'
              }`}
            >
              <Text className="mb-4 text-3xl">
                {t.icon}
              </Text>
              <Text className="text-lg font-semibold text-white">
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CTA */}
      <Pressable
        disabled={!selected}
        onPress={() => selected && onNext(selected)}
        className={`mt-auto mb-8 rounded-full py-4 ${
          selected
            ? 'bg-blue-500'
            : 'bg-neutral-700'
        }`}
      >
        <Text className="text-center text-lg font-bold text-white">
          NEXT
        </Text>
      </Pressable>
    </View>
  );
}

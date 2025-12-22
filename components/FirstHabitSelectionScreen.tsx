import { View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Habit, Identity } from '../model/types';

export default function FirstHabitSelectionScreen({
  identity,
  onNext,
  onSkip,
}: {
  identity: Identity;
  onNext: (habit: Habit) => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<Habit | null>(null);
  const [customHabit, setCustomHabit] = useState<Habit | null>(null);

  const finalHabit = customHabit || selected;
  return (
    <View className="flex-1 bg-neutral-900 px-6 pt-16">
      {/* Progress */}
      <View className="mb-10 flex-row space-x-2">
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
        <View className="h-1 flex-1 rounded bg-blue-500" />
      </View>

      <Text className="text-3xl font-extrabold text-white">Choose the first habit</Text>
      <Text className="mt-2 text-sm text-neutral-400">that you’d like to build</Text>

      {/* Habit list */}
      <View className="mt-8 space-y-3">
        {identity.habits.map((h) => {
          const isSelected = selected?.id === h.id;

          return (
            <Pressable
              key={h.id}
              onPress={() => {
                setSelected(h);
              }}
              className={`flex-row items-center rounded-xl px-4 py-4 ${
                isSelected ? 'bg-neutral-700' : 'bg-neutral-800'
              }`}>
              <Text className="mr-4 text-2xl">{h.icon}</Text>
              <Text className="text-base font-semibold text-white">{h.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Custom habit */}
      <Text className="my-6 text-center text-sm text-neutral-500">Or type your own</Text>

      <TextInput
        value={customHabit?.label}
        onChangeText={(t) => {
          setCustomHabit({ id: 'custom', label: t, icon: '🆕', checkedToday: null });
          setSelected(null);
        }}
        placeholder="Your first habit is..."
        placeholderTextColor="#6B7280"
        className="rounded-xl bg-neutral-800 px-4 py-4 text-white"
      />

      {/* Actions */}
      <View className="mb-8 mt-auto flex-row justify-between">
        <Pressable onPress={onSkip} className="w-[48%] rounded-full bg-neutral-700 py-4">
          <Text className="text-center font-bold text-white">SKIP</Text>
        </Pressable>

        <Pressable
          disabled={!finalHabit}
          onPress={() => finalHabit && onNext(finalHabit)}
          className={`w-[48%] rounded-full py-4 ${finalHabit ? 'bg-blue-500' : 'bg-neutral-700'}`}>
          <Text className="text-center font-bold text-white">NEXT</Text>
        </Pressable>
      </View>
    </View>
  );
}

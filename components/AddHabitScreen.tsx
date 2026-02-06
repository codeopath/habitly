import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Timing, UserHabit } from '../model/types';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams } from 'expo-router';

const TIMING_OPTIONS = [
  Timing.Morning,
  Timing.Afternoon,
  Timing.Evening,
  Timing.Night,
  Timing.Anytime,
];

export default function AddHabitScreen({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (habit: UserHabit) => void;
}) {
  const { identity } = useLocalSearchParams<{ identity: string }>();

  const [label, setLabel] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Timing>(Timing.Anytime);
  const [duration, setDuration] = useState<number>(15);

  const canSave = label.trim().length > 0;

  return (
    <View className="flex-1 bg-neutral-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable onPress={onCancel}>
          <Text className="text-base text-neutral-400">Cancel</Text>
        </Pressable>

        <Text className="text-lg font-bold text-white">Add Habit</Text>

        <Pressable
          disabled={!canSave}
          onPress={() =>
            onSave({
              id: Crypto.randomUUID(),
              label: label.trim(),
              duration,
              icon: '',
              identityId: identity,
              timing: timeOfDay,
              logs: [],
            })
          }>
          <Text
            className={`text-base font-semibold ${canSave ? 'text-blue-500' : 'text-neutral-600'}`}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Habit name */}
        <View className="mb-6">
          <Text className="mb-2 text-xs font-semibold tracking-widest text-neutral-400">HABIT</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="What do you want to do?"
            placeholderTextColor="#6B7280"
            className="rounded-2xl bg-neutral-800 px-4 py-4 text-base text-white"
          />
        </View>

        {/* Timing */}
        <View className="mb-6">
          <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
            PREFERRED TIME
          </Text>

          <View className="flex-row flex-wrap">
            {TIMING_OPTIONS.map((t) => {
              const active = timeOfDay === t;

              return (
                <Pressable
                  key={t}
                  onPress={() => setTimeOfDay(t)}
                  className={`mb-3 mr-3 rounded-full px-5 py-2 ${
                    active ? 'bg-blue-500' : 'bg-neutral-800'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      active ? 'text-white' : 'text-neutral-400'
                    }`}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Duration */}
        <View className="mb-10">
          <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
            DURATION
          </Text>

          <View className="flex-row items-center justify-between rounded-2xl bg-neutral-800 px-6 py-4">
            <Pressable
              onPress={() => setDuration((d) => Math.max(5, d - 5))}
              className="h-10 w-10 items-center justify-center rounded-full bg-neutral-700">
              <Text className="text-2xl text-white">−</Text>
            </Pressable>

            <Text className="text-xl font-bold text-white">{duration} min</Text>

            <Pressable
              onPress={() => setDuration((d) => d + 5)}
              className="h-10 w-10 items-center justify-center rounded-full bg-neutral-700">
              <Text className="text-2xl text-white">+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

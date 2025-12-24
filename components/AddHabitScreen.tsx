import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Timing, UserHabit } from '../model/types';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams } from 'expo-router';

const TIMING = Object.values(Timing);

export default function AddHabitScreen({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (habit: UserHabit) => void;
}) {
  const [label, setLabel] = useState('');
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const [timeOfDay, setTimeOfDay] = useState<Timing>(Timing.Anytime);
  const [duration, setDuration] = useState<string>('60');

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
              label: label.trim(),
              duration: Number.parseFloat(duration),
              id: Crypto.randomUUID(),
              icon: '',
              checkedToday: null,
              identityId: identity,
              timing: timeOfDay,
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

        {/* Time of day */}
        <View className="mb-6">
          <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">TIME</Text>
          <View className="flex-row flex-wrap">
            {TIMING.map((t) => {
              const selected = timeOfDay === t;

              return (
                <Pressable
                  key={t}
                  onPress={() => setTimeOfDay(t)}
                  className={`mb-3 mr-3 rounded-full px-5 py-2 ${
                    selected ? 'bg-blue-500' : 'bg-neutral-800'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? 'text-white' : 'text-neutral-400'
                    }`}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Duration (optional) */}
        <View className="mb-10">
          <Text className="mb-2 text-xs font-semibold tracking-widest text-neutral-400">
            DURATION
          </Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="Minutes (e.g. 15)"
            placeholderTextColor="#6B7280"
            className="rounded-2xl bg-neutral-800 px-4 py-4 text-base text-white"
          />
        </View>
      </ScrollView>
    </View>
  );
}

import { View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { UserHabit, UserIdentity, Timing } from '../model/types';

export default function FirstHabitSelectionScreen({
  identity,
  onNext,
  onSkip,
}: {
  identity: UserIdentity;
  onNext: (habit: UserHabit) => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<UserHabit | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [duration, setDuration] = useState(15);
  const [timing, setTiming] = useState<Timing>(Timing.Anytime);

  const timingOptions = [
    Timing.Morning,
    Timing.Afternoon,
    Timing.Evening,
    Timing.Night,
    Timing.Anytime,
  ];

  const finalHabit: UserHabit | null = selected
    ? {
        ...selected,
        identityId: identity.id,
        logs: [],
        duration,
        timing,
      }
    : customLabel
      ? {
          id: 'custom',
          label: customLabel,
          icon: '🆕',
          duration,
          timing,
          identityId: identity.id,
          logs: [],
        }
      : null;

  return (
    <View className="flex-1 bg-neutral-900 px-6 pt-16">
      {/* Progress */}
      <View className="mb-10 flex-row space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="h-1 flex-1 rounded bg-blue-500" />
        ))}
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
                setCustomLabel('');
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
        value={customLabel}
        onChangeText={(t) => {
          setCustomLabel(t);
          setSelected(null);
        }}
        placeholder="Your first habit is..."
        placeholderTextColor="#6B7280"
        className="rounded-xl bg-neutral-800 px-4 py-4 text-white"
      />

      {/* Duration */}
      {(selected || customLabel) && (
        <>
          <View className="mt-8">
            <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
              DAILY DURATION
            </Text>

            <View className="flex-row items-center justify-between rounded-2xl bg-neutral-800 px-6 py-4">
              <Pressable onPress={() => setDuration(Math.max(5, duration - 5))}>
                <Text className="text-2xl text-white">−</Text>
              </Pressable>

              <Text className="text-xl font-bold text-white">{duration} min</Text>

              <Pressable onPress={() => setDuration(duration + 5)}>
                <Text className="text-2xl text-white">+</Text>
              </Pressable>
            </View>
          </View>

          {/* Timing */}
          <View className="mt-6">
            <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
              PREFERRED TIME
            </Text>

            <View className="flex-row flex-wrap">
              {timingOptions.map((t) => {
                const active = timing === t;

                return (
                  <Pressable
                    key={t}
                    onPress={() => setTiming(t)}
                    className={`mb-3 mr-3 rounded-full px-4 py-2 ${
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
        </>
      )}

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

import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Habit, Timing, UserHabit } from '../model/types';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams } from 'expo-router';
import { fetchIdentities } from '../api/identities';
import { useIdentitiesContext } from '../context/IdentitiesContext';

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
  initialLabel = '',
  initialTiming = Timing.Anytime,
  initialDuration = 15,
  title = 'Add Habit',
}: {
  onCancel: () => void;
  onSave: (habit: UserHabit) => void;
  initialLabel?: string;
  initialTiming?: Timing;
  initialDuration?: number;
  title?: string;
}) {
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const { identities: userIdentities } = useIdentitiesContext();

  const [label, setLabel] = useState(initialLabel);
  const [icon, setIcon] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Timing>(initialTiming);
  const [duration, setDuration] = useState<number>(initialDuration);
  const [suggestedHabits, setSuggestedHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchIdentities().then((data) => {
      const userIdentity = userIdentities.find((i) => i.id === identity);
      if (!userIdentity) return;

      const existingLabels = new Set(userIdentity.habits.map((h) => h.label));

      // Find the matching template identity by label
      const matchingTemplate = data.find((t) => t.label === userIdentity.label);
      if (!matchingTemplate) return;

      setSuggestedHabits(matchingTemplate.habits.filter((h) => !existingLabels.has(h.label)));
    });
  }, [identity, userIdentities]);

  const canSave = label.trim().length > 0;

  return (
    <View className="flex-1 bg-neutral-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable onPress={onCancel}>
          <Text className="text-base text-neutral-400">Cancel</Text>
        </Pressable>

        <Text className="text-lg font-bold text-white">{title}</Text>

        <Pressable
          disabled={!canSave}
          onPress={() =>
            onSave({
              id: Crypto.randomUUID(),
              label: label.trim(),
              duration,
              icon,
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
        {/* Suggested habits */}
        {suggestedHabits.length > 0 && (
          <View className="mb-6">
            <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
              SUGGESTIONS
            </Text>

            <View className="flex-row flex-wrap">
              {suggestedHabits.map((h) => {
                const isSelected = label === h.label;

                return (
                  <Pressable
                    key={h.id}
                    onPress={() => {
                      setLabel(h.label);
                      setIcon(h.icon);
                    }}
                    className={`mb-3 mr-3 flex-row items-center rounded-full px-4 py-2 ${
                      isSelected ? 'bg-blue-500' : 'bg-neutral-800'
                    }`}>
                    <Text className="mr-2 text-base">{h.icon}</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-400'
                      }`}>
                      {h.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Divider */}
        {suggestedHabits.length > 0 && (
          <Text className="mb-6 text-center text-sm text-neutral-500">Or type your own</Text>
        )}

        {/* Habit name */}
        <View className="mb-6">
          <Text className="mb-2 text-xs font-semibold tracking-widest text-neutral-400">HABIT</Text>
          <TextInput
            value={label}
            onChangeText={(t) => {
              setLabel(t);
              setIcon('');
            }}
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

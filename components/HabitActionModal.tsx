import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { UserHabit } from '../model/types';

export default function HabitActionModal({
  habit,
  visible,
  onClose,
  onComplete,
}: {
  habit: UserHabit;
  visible: boolean;
  onClose: () => void;
  onComplete: (duration: number) => void;
}) {
  const [duration, setDuration] = useState(habit.duration);

  const adjustDuration = (delta: number) => {
    const next = Math.max(5, duration + delta);
    setDuration(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      <View className="rounded-t-3xl bg-neutral-900 px-6 py-6">
        <Text className="mb-2 text-lg font-bold text-white">{habit.label}</Text>

        <Text className="mb-6 text-sm text-neutral-400">How much did you do?</Text>

        {/* Duration controls */}
        <View className="mb-6 flex-row items-center justify-between">
          <Pressable
            onPress={() => adjustDuration(-5)}
            className="h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
            <Text className="text-xl text-white">−</Text>
          </Pressable>

          <Text className="text-2xl font-bold text-white">{duration} min</Text>

          <Pressable
            onPress={() => adjustDuration(5)}
            className="h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
            <Text className="text-xl text-white">+</Text>
          </Pressable>
        </View>

        {/* Actions */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onComplete(duration);
          }}
          className="mb-3 rounded-2xl bg-blue-500 py-4">
          <Text className="text-center text-base font-semibold text-white">Mark completed</Text>
        </Pressable>

        <Pressable onPress={onClose} className="py-3">
          <Text className="text-center text-neutral-400">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

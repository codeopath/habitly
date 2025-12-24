import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useIdentities } from '../hooks/useIdentities';
import * as Crypto from 'expo-crypto';

const ICONS = ['🙂', '💪', '📘', '🧠', '🎯', '🌱', '❤️'];

export default function AddIdentityRoute() {
  const router = useRouter();
  const { addIdentity } = useIdentities();

  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('🙂');

  const canSave = label.trim().length > 0;

  return (
    <View className="flex-1 bg-neutral-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable onPress={() => router.dismissAll()}>
          <Text className="text-base text-neutral-400">Cancel</Text>
        </Pressable>

        <Text className="text-lg font-bold text-white">
          Add Identity
        </Text>

        <Pressable
          disabled={!canSave}
          onPress={() => {
            addIdentity({
              id: Crypto.randomUUID(),
              label: label.trim(),
              icon,
              habits: [],
            });

            router.replace('/select-identity');
          }}
        >
          <Text
            className={`text-base font-semibold ${
              canSave ? 'text-blue-500' : 'text-neutral-600'
            }`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      {/* Identity name */}
      <View className="mb-6">
        <Text className="mb-2 text-xs font-semibold tracking-widest text-neutral-400">
          IDENTITY
        </Text>

        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. I am a reader"
          placeholderTextColor="#6B7280"
          className="rounded-2xl bg-neutral-800 px-4 py-4 text-base text-white"
        />
      </View>

      {/* Icon picker */}
      <View>
        <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
          ICON
        </Text>

        <View className="flex-row flex-wrap">
          {ICONS.map((i) => {
            const selected = icon === i;

            return (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                className={`mr-3 mb-3 h-12 w-12 items-center justify-center rounded-full ${
                  selected ? 'bg-blue-500' : 'bg-neutral-800'
                }`}
              >
                <Text className="text-xl">{i}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

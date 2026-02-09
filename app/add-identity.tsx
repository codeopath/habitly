import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { useIdentitiesContext } from '../context/IdentitiesContext';
import { useRevenueCat } from '../context/RevenueCatContext';
import { fetchIdentities } from '../api/identities';
import { Identity } from '../model/types';

const ICONS = ['🙂', '💪', '📘', '🧠', '🎯', '🌱', '❤️'];

export default function AddIdentityRoute() {
  const router = useRouter();
  const { addIdentity, identities: userIdentities } = useIdentitiesContext();
  const { isProUser, showPaywall } = useRevenueCat();
  const FREE_IDENTITY_LIMIT = 3;

  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('🙂');
  const [templateIdentities, setTemplateIdentities] = useState<Identity[]>([]);

  useEffect(() => {
    fetchIdentities().then((data) => {
      const existingLabels = new Set(userIdentities.map((i) => i.label));
      setTemplateIdentities(data.filter((t) => !existingLabels.has(t.label)));
    });
  }, [userIdentities]);

  const canSave = label.trim().length > 0;

  return (
    <View className="flex-1 bg-neutral-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base text-neutral-400">Cancel</Text>
        </Pressable>

        <View className="items-center">
          <Text className="text-lg font-bold text-white">Add Identity</Text>
          {!isProUser && (
            <Text className="text-xs text-neutral-500">
              {userIdentities.length}/{FREE_IDENTITY_LIMIT} identities
            </Text>
          )}
        </View>

        <Pressable
          disabled={!canSave}
          onPress={async () => {
            if (!isProUser && userIdentities.length >= FREE_IDENTITY_LIMIT) {
              await showPaywall();
              return;
            }
            addIdentity({
              id: Crypto.randomUUID(),
              label: label.trim(),
              icon,
              habits: [],
            });

            router.replace('/select-identity');
          }}>
          <Text
            className={`text-base font-semibold ${canSave ? 'text-blue-500' : 'text-neutral-600'}`}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Pre-defined identities */}
        {templateIdentities.length > 0 && (
          <View className="mb-8">
            <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">
              SUGGESTIONS
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {templateIdentities.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={async () => {
                    if (!isProUser && userIdentities.length >= FREE_IDENTITY_LIMIT) {
                      await showPaywall();
                      return;
                    }
                    addIdentity({
                      id: Crypto.randomUUID(),
                      label: t.label,
                      icon: t.icon,
                      habits: [],
                    });
                    router.replace('/select-identity');
                  }}
                  className="mb-4 w-[48%] rounded-2xl bg-neutral-800 p-5">
                  <Text className="mb-4 text-3xl">{t.icon}</Text>
                  <Text className="text-lg font-semibold text-white">{t.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Divider */}
        {templateIdentities.length > 0 && (
          <Text className="mb-6 text-center text-sm text-neutral-500">Or create your own</Text>
        )}

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
        <View className="mb-8">
          <Text className="mb-3 text-xs font-semibold tracking-widest text-neutral-400">ICON</Text>

          <View className="flex-row flex-wrap">
            {ICONS.map((i) => {
              const selected = icon === i;

              return (
                <Pressable
                  key={i}
                  onPress={() => setIcon(i)}
                  className={`mb-3 mr-3 h-12 w-12 items-center justify-center rounded-full ${
                    selected ? 'bg-blue-500' : 'bg-neutral-800'
                  }`}>
                  <Text className="text-xl">{i}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

const IDENTITIES = [
  'I am a reader',
  'I am healthy',
  'I am consistent',
  'I am focused',
  'I show up daily',
];

export default function OnboardingIdentityScreen({
  onNext,
}: {
  onNext: (identity: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-white px-6 pt-20 dark:bg-black">
      <Text className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Who do you want to be?
      </Text>

      <Text className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Choose an identity you want to build through small actions.
      </Text>

      <View className="space-y-3">
        {IDENTITIES.map((item) => {
          const isSelected = selected === item;

          return (
            <Pressable
              key={item}
              onPress={() => setSelected(item)}
              className={`rounded-xl border p-4 ${
                isSelected
                  ? 'border-gray-900 bg-gray-100 dark:border-gray-100 dark:bg-gray-900'
                  : 'border-gray-200 dark:border-gray-800'
              }`}>
              <Text
                className={`text-base ${
                  isSelected
                    ? 'font-semibold text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={!selected}
        onPress={() => selected && onNext(selected)}
        className={`mt-10 rounded-xl py-4 ${
          selected ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300 dark:bg-gray-800'
        }`}>
        <Text
          className={`text-center font-semibold ${
            selected ? 'text-white dark:text-gray-900' : 'text-gray-500'
          }`}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}

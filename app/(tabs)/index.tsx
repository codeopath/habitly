import { View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import { Identity } from '../../model/types';
import IdentityCard from '../../components/IdentityCard';

export default function HomeScreen() {
  const [identities, setIdentities] = useState<Identity[]>([
    {
      id: 'identity-1',
      name: 'I am an avid reader',
      habits: [
        { id: 'reader-1', title: 'I read today', checkedToday: null, duration: 15 },
        { id: 'reader-2', title: 'I reflected on what I read', checkedToday: null, duration: 15 },
      ],
    },
    {
      id: 'identity-2',
      name: 'I am healthy',
      habits: [
        { id: 'health-1', title: 'I exercised today', checkedToday: null, duration: 15 },
        { id: 'health-2', title: 'I ate mindfully', checkedToday: null, duration: 15 },
      ],
    },
  ]);

  const handleHabitCheck = (identityId: string, habitId: string, duration: number) => {
    setIdentities((prev) =>
      prev.map((identity) =>
        identity.id !== identityId
          ? identity
          : {
              ...identity,
              habits: identity.habits.map((h) =>
                h.id === habitId
                  ? {
                      ...h,
                      duration,
                      checkedToday: duration > 0,
                    }
                  : h
              ),
            }
      )
    );
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <View className="flex-1 bg-white px-5 pt-16 dark:bg-black">
      <Text className="mb-4 text-xs text-gray-400 dark:text-gray-500">Today • {today}</Text>

      <FlatList
        data={identities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IdentityCard identity={item} onHabitCheck={handleHabitCheck} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

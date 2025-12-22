import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { Identity } from '../../model/types';
import IdentityCard from '../../components/IdentityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [identities, setIdentities] = useState<Identity[]>([]);

  useEffect(() => {
    const load = async () => {
      const savedIdentities = await AsyncStorage.getItem('identities');
      if (savedIdentities) {
        setIdentities(JSON.parse(savedIdentities));
      }
    };
    load();
  }, []);

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

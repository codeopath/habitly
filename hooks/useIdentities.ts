import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, Identity } from '../model/types';

const STORAGE_KEY = 'identities';

export function useIdentities() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load once
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setIdentities(JSON.parse(saved));
      }
      setLoaded(true);
    };
    load();
  }, []);

  // Persist on change (AFTER load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(identities));
  }, [identities, loaded]);

  const addIdentity = (identity: Identity) => {
    setIdentities((prev) => [...prev, identity]);
  };

  const updateHabit = (identityId: string, habitId: string, duration: number) => {
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

  const addHabit = (habit: Habit) => {
    setIdentities((prev) => {
      const exists = prev.find((i) => i.id === habit.identityId);

      // Identity exists → add habit
      if (exists) {
        return prev.map((i) =>
          i.id !== habit.identityId ? i : { ...i, habits: [...i.habits, habit] }
        );
      }

      // Identity does NOT exist → create it
      return [
        ...prev,
        {
          id: habit.identityId,
          label: 'A good habit',
          icon: habit.icon ?? '🙂',
          habits: [habit],
        },
      ];
    });
  };

  return {
    identities,
    loaded,
    updateHabit,
    addHabit,
    addIdentity,
  };
}

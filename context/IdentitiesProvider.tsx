import { ReactNode, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserHabit, UserIdentity } from '../model/types';
import { IdentitiesContext } from './IdentitiesContext';

export function IdentitiesProvider({ children }: { children: ReactNode }) {
  const [identities, setIdentities] = useState<UserIdentity[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('identities').then((saved) => {
      if (saved) setIdentities(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('identities', JSON.stringify(identities));
  }, [identities]);

  const addIdentity = (identity: UserIdentity) => {
    setIdentities((prev) => [...prev, identity]);
  };

  const addHabit = (habit: UserHabit) => {
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

  const updateHabit = (habit: UserHabit, duration: number) => {
    const today = new Date().toISOString().slice(0, 10);

    setIdentities((prev) =>
      prev.map((identity) =>
        identity.id === habit.identityId
          ? {
              ...identity,
              habits: identity.habits.map((h) =>
                h.id === habit.id
                  ? {
                      ...h,
                      logs: [...(h.logs ?? []), { date: today, duration }],
                    }
                  : h
              ),
            }
          : identity
      )
    );
  };

  const uncheckHabit = (habit: UserHabit) => {
    const today = new Date().toISOString().slice(0, 10);
    setIdentities((prev) =>
      prev.map((identity) =>
        identity.id === habit.identityId
          ? {
              ...identity,
              habits: identity.habits.map((h) =>
                h.id === habit.id
                  ? { ...h, logs: (h.logs ?? []).filter((l) => l.date !== today) }
                  : h
              ),
            }
          : identity
      )
    );
  };

  const enrichedIdentities = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return identities.map((identity) => ({
      ...identity,
      habits: identity.habits.map((h) => ({
        ...h,
        checkedToday: (h.logs ?? []).some((l) => l.date === today),
      })),
    }));
  }, [identities]);

  return (
    <IdentitiesContext.Provider
      value={{ identities: enrichedIdentities, updateHabit, uncheckHabit, addHabit, addIdentity }}>
      {children}
    </IdentitiesContext.Provider>
  );
}

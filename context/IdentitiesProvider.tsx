import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserHabit, UserIdentity } from '../model/types';
import { IdentitiesContext } from './IdentitiesContext';
import { scheduleHabitNotifications } from '../utils/notifications';

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

  const editHabit = (
    habitId: string,
    updates: Partial<Pick<UserHabit, 'label' | 'timing' | 'duration'>>
  ) => {
    setIdentities((prev) =>
      prev.map((identity) => ({
        ...identity,
        habits: identity.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
      }))
    );
  };

  const deleteHabit = (habitId: string) => {
    setIdentities((prev) =>
      prev.map((identity) => ({
        ...identity,
        habits: identity.habits.filter((h) => h.id !== habitId),
      }))
    );
  };

  const editIdentity = (
    identityId: string,
    updates: Partial<Pick<UserIdentity, 'label' | 'icon'>>
  ) => {
    setIdentities((prev) =>
      prev.map((identity) => (identity.id === identityId ? { ...identity, ...updates } : identity))
    );
  };

  const deleteIdentity = (identityId: string) => {
    setIdentities((prev) => prev.filter((identity) => identity.id !== identityId));
  };

  const reorderHabits = (identityId: string, reorderedHabits: UserHabit[]) => {
    setIdentities((prev) =>
      prev.map((identity) =>
        identity.id === identityId ? { ...identity, habits: reorderedHabits } : identity
      )
    );
  };

  // Reschedule notifications when habits change (debounced)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      scheduleHabitNotifications(identities);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [identities]);

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
      value={{
        identities: enrichedIdentities,
        updateHabit,
        uncheckHabit,
        addHabit,
        addIdentity,
        editHabit,
        deleteHabit,
        editIdentity,
        deleteIdentity,
        reorderHabits,
      }}>
      {children}
    </IdentitiesContext.Provider>
  );
}

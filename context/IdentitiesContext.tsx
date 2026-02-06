import { createContext, useContext } from 'react';
import { UserHabit, UserIdentity } from '../model/types';

type IdentitiesContextType = {
  identities: UserIdentity[];
  updateHabit: (habit: UserHabit, duration: number) => void;
  uncheckHabit: (habit: UserHabit) => void;
  addHabit: (habit: UserHabit) => void;
  addIdentity: (identity: UserIdentity) => void;
  editHabit: (
    habitId: string,
    updates: Partial<Pick<UserHabit, 'label' | 'timing' | 'duration'>>
  ) => void;
  deleteHabit: (habitId: string) => void;
  editIdentity: (
    identityId: string,
    updates: Partial<Pick<UserIdentity, 'label' | 'icon'>>
  ) => void;
  deleteIdentity: (identityId: string) => void;
};

export const IdentitiesContext = createContext<IdentitiesContextType | null>(null);

export const useIdentitiesContext = () => {
  const ctx = useContext(IdentitiesContext);
  if (!ctx) {
    throw new Error('useIdentitiesContext must be used inside provider');
  }
  return ctx;
};

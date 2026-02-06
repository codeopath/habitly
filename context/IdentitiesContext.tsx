import { createContext, useContext } from 'react';
import { UserHabit, UserIdentity } from '../model/types';

type IdentitiesContextType = {
  identities: UserIdentity[];
  updateHabit: (habit: UserHabit, duration: number) => void;
  uncheckHabit: (habit: UserHabit) => void;
  addHabit: any;
  addIdentity: any;
};

export const IdentitiesContext = createContext<IdentitiesContextType | null>(null);

export const useIdentitiesContext = () => {
  const ctx = useContext(IdentitiesContext);
  if (!ctx) {
    throw new Error('useIdentitiesContext must be used inside provider');
  }
  return ctx;
};

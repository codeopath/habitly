export type HabitLog = {
  date: string; // YYYY-MM-DD
  duration: number;
};

export type UserHabit = {
  id: string;
  identityId: string;
  label: string;
  icon: string;
  duration: number;
  timing: Timing;
  logs: HabitLog[];
  checkedToday?: boolean;
};

export enum Timing {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
  Anytime = 'Anytime',
}
export type UserIdentity = {
  id: string;
  label: string;
  icon: string;
  habits: UserHabit[];
};

export type Habit = {
  id: string;
  identityId: string;
  label: string;
  icon: string;
};

export type Identity = {
  id: string;
  label: string;
  icon: string;
  habits: Habit[];
};

export type UserHabit = {
  id: string;
  identityId: string;
  label: string;
  icon: string;
  duration?: number;
  timing: Timing;
  checkedToday: boolean | null;
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

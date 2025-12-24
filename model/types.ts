export type Habit = {
  id: string;
  identityId: string;
  label: string;
  icon: string;
  duration?: number;
  checkedToday: boolean | null;
};

export type Identity = {
  id: string;
  label: string;
  icon: string;
  habits: Habit[];
};

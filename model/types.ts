export type Habit = {
  id: string;
  label: string;
  icon: string;
};

export type Identity = {
  id: string;
  label: string;
  icon: string;
  habits: Habit[];
};

export type Habit = {
  id: string;
  title: string;
  duration: number; // in minutes
  checkedToday: boolean | null;
};

export type Identity = {
  id: string;
  name: string;
  habits: Habit[];
};

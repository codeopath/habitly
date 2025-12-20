export type Habit = {
  id: string;
  title: string;
  duration: number; // in minutes
  checkedToday: boolean | null;
};

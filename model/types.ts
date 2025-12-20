export type Habit = {
  id: string;
  title: string;
  checkedToday: boolean | null; // true | false | null (not checked)
};

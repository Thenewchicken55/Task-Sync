export interface Todo {
  id: string;
  title: string;
  description: string;
  isRecurring: boolean;
  recurrenceType?: "daily";
  date?: string;
  completed?: boolean;
  completedAt?: string;
  priority?: 1 | 2 | 3;
}

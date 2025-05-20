export interface Todo {
  id: string;
  title: string;
  description: string;
  isRecurring: boolean;
  recurrenceType?: "daily";
  recurrenceDays?: number[];
  location?: string;
  date?: string;
  completed?: boolean;
  completedAt?: string;
  priority?: 1 | 2 | 3;
}

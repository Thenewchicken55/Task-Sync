export interface Todo {
  id: string;
  title: string;
  description: string;
  isRecurring: boolean;
  recurrenceType?: string;
  recurrenceDays?: number[];
  location?: string;
  date?: string;
  endDate?: string;
  completed?: boolean;
  completedAt?: string;
  priority?: 1 | 2 | 3;
  unitNumber?: number;
  duration?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: any;
}

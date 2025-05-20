import { Todo } from "./todo";

export interface AddTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (todo: Todo) => void;
    onComplete?: (id: string) => void;
    initialTodo?: Todo | null;
}

export interface AddTodoModalProps2 {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (todo: Todo[]) => void;
    onComplete?: (id: string) => void;
    initialTodo?: Todo | null;
}
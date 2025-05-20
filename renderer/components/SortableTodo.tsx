"use client";

import { Todo } from "../types/todo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTodoProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onComplete: (id: string) => void;
  isSortable: boolean;
}

export function SortableTodo({
  todo,
  onDelete,
  onEdit,
  onComplete,
  isSortable,
}: SortableTodoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: !isSortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isSortable) return;

    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    e.dataTransfer.setData("text/plain", todo.id);
    e.dataTransfer.effectAllowed = "move";

    e.currentTarget.classList.add("opacity-50");

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (isSortable) return;
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleClick = () => {
    onEdit(todo);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      draggable={!isSortable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="bg-white p-4 mb-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow relative group"
      data-todo-id={todo.id}
      data-draggable="true"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black">{todo.title}</h3>
          <p className="text-sm text-black mt-1">{todo.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            {todo.isRecurring && (
              <span className="inline-block bg-blue-100 text-black text-xs px-2 py-1 rounded">
                Recurring
              </span>
            )}
            {todo.priority && (
              <div className="flex space-x-0.5">
                {([1, 2, 3] as const).map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 cursor-pointer select-none ${
                      star <= todo.priority!
                        ? "text-yellow-600"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete button clicked");
            onDelete(todo.id);
          }}
          className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
        >
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(todo.id);
          }}
          className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
        ></button>
      </div>
    </div>
  );
}

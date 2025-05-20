"use client";

import { useState, useEffect, useRef } from "react";
import { SortableTodo } from "./SortableTodo";
import { Todo } from "../types/todo";
import AddTodoModal from "./AddTodoModal";
import { Draggable } from "@fullcalendar/interaction";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TodoListProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export default function TodoList({ todos, setTodos }: TodoListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isSortable, setIsSortable] = useState(false);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (dragContainerRef.current && !isSortable) {
      new Draggable(dragContainerRef.current, {
        itemSelector: "[data-draggable='true']",
        eventData: function (el) {
          const id = el.getAttribute("data-todo-id");
          const title = el.querySelector("h3")?.textContent || "Untitled";
          return {
            id,
            title,
            create: true,
          };
        },
      });
    }
  }, [isSortable]);

  const handleDelete = (id: string) => {
    console.log("Deleting todo with id:", id);
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    console.log("Updated todos:", updatedTodos);
    setTodos(updatedTodos);
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: true,
          completedAt: new Date().toISOString(),
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleAddTodo = (todo: Todo) => {
    if (selectedTodo) {
      const updatedTodos = todos.map((t) => (t.id === todo.id ? todo : t));
      setTodos(updatedTodos);
    } else {
      setTodos([...todos, todo]);
    }
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      setTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  const nonCompletedTodos = todos.filter((todo) => !todo.completed);

  const filteredTodos = nonCompletedTodos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-400">Tasks</h2>
        <button
          onClick={() => setIsSortable(!isSortable)}
          className={`group relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
            isSortable
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 mr-2 transition-transform duration-200 ${
              isSortable ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          {isSortable ? "Disable Sorting" : "Enable Sorting"}
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={dragContainerRef}
        className="h-[calc(100vh-16rem)] overflow-y-auto"
      >
        {isSortable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <SortableTodo
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onComplete={handleComplete}
                  isSortable={isSortable}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          filteredTodos.map((todo) => (
            <SortableTodo
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onComplete={handleComplete}
              isSortable={isSortable}
            />
          ))
        )}
      </div>
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTodo(null);
        }}
        onAdd={handleAddTodo}
        onComplete={handleComplete}
        initialTodo={selectedTodo}
      />
    </div>
  );
}

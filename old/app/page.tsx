"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import Calendar from "./components/Calendar";
import AddTodoModal from "./components/AddTodoModal";
import { Todo } from "./types/todo";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useLocalStorage<Todo[]>("tasks", []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
    setIsModalOpen(false);
  };

  const handleUpdateTodos = (newTodos: Todo[]) => {
    console.log("Updating todos:", newTodos);
    setTodos(newTodos);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 overscroll-none">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 transform -rotate-0.5 hover:rotate-0 transition-transform duration-300 border border-gray-200">
            <div className="flex flex-col items-center mb-6 mt-2">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Task List
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Task
              </button>
            </div>
            <TodoList todos={todos} setTodos={handleUpdateTodos} />
          </div>
          <div className="w-2/3 bg-white rounded-lg shadow-lg p-6 transform rotate-0.5 hover:rotate-0 transition-transform duration-300 border border-gray-200">
            <Calendar todos={todos} setTodos={handleUpdateTodos} />
          </div>
        </div>
      </div>
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  );
}

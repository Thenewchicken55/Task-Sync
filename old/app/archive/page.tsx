"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Todo } from "../types/todo";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Archive() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("tasks", []);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClearAll = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
  };

  if (!isMounted) {
    return null;
  }

  const completedTodos = todos.filter((todo) => todo.completed);

  const filteredTodos = completedTodos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 overscroll-none">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 transform -rotate-0.5 hover:rotate-0 transition-transform duration-300 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-black">
                  Completed Tasks
                </h2>
                <p className="text-gray-500 mt-1">
                  {completedTodos.length}{" "}
                  {completedTodos.length === 1 ? "task" : "tasks"} completed
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search completed tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                {completedTodos.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear All
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {filteredTodos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No completed tasks found
                </p>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {todo.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {todo.description}
                        </p>
                        {todo.isRecurring && (
                          <span className="inline-block bg-blue-100 text-gray-800 text-xs px-2 py-1 rounded mt-2">
                            Recurring
                          </span>
                        )}
                        {todo.priority && (
                          <div className="flex space-x-0.5 mt-2">
                            {([1, 2, 3] as const).map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${
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
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                          <p>
                            Assigned on:{" "}
                            {todo.date
                              ? new Date(todo.date).toLocaleDateString()
                              : "Not assigned"}
                          </p>
                          <p>
                            Completed on:{" "}
                            {todo.completedAt
                              ? new Date(todo.completedAt).toLocaleDateString()
                              : "Not completed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

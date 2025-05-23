"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Todo } from "../types/todo";
import { AddTodoModalProps } from "../types/AddTodoModalProps";
import { v4 as uuidv4 } from "uuid";

export default function AddTodoModal({
  isOpen,
  onClose,
  onAdd,
  onComplete,
  initialTodo,
}: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<"daily">("daily");
  const [priority, setPriority] = useState<1 | 2 | 3 | undefined>(undefined);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description);
      setIsRecurring(initialTodo.isRecurring);
      setRecurrenceType("daily");
      setPriority(initialTodo.priority);
      setDate(initialTodo.date || "");
    } else {
      setTitle("");
      setDescription("");
      setIsRecurring(false);
      setRecurrenceType("daily");
      setPriority(undefined);
      setDate("");
    }
  }, [initialTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todo: Todo = {
      id: initialTodo?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      date: initialTodo?.date,
      completed: initialTodo?.completed || false,
      completedAt: initialTodo?.completedAt,
      isRecurring,
      recurrenceType: isRecurring ? recurrenceType : undefined,
      priority,
    };

    onAdd(todo);
    setTitle("");
    setDescription("");
    setIsRecurring(false);
    setRecurrenceType("daily");
    setPriority(undefined);
    setDate("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-gray-900 mb-6"
                >
                  {initialTodo ? "Edit Test" : "Add New Test"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-gray-800 text-gray-900 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-gray-800 text-gray-900 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="flex space-x-2">
                        {([1, 2, 3] as const).map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setPriority(priority === star ? undefined : star)
                            }
                            className={`p-2 rounded-md transition-colors duration-200 cursor-pointer select-none ${
                              priority && star <= priority
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800 transition-colors duration-200"
                      />
                      <label
                        htmlFor="recurring"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Daily Recurring Test
                      </label>
                    </div>

                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-gray-800 text-gray-900 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end space-x-4">
                    {initialTodo && onComplete && (
                      <button
                        type="button"
                        onClick={() => {
                          onComplete(initialTodo.id);
                          onClose();
                        }}
                        className="inline-flex items-center px-4 py-2 bg-[#556B2F] text-white rounded-md hover:bg-[#6B8E23] transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Complete Test
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {initialTodo ? "Save Changes" : "Add Test"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

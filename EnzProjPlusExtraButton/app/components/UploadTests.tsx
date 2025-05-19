"use client";

import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Todo } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: Todo) => void;
  onComplete?: (id: string) => void;
  initialTodo?: Todo | null;
}

export default function UploadTests({
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
      setRecurrenceType(initialTodo.recurrenceType || "daily");
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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle the uploaded file here
      console.log(file); // You can do something with the file, like save it to a server or perform other actions.
      // You can also update the state or perform other actions based on the file.
    }
  };
  const downloadFile = () => {
    
    // Define the CSV content
     const csvContent = 'data:text/csv;charset=utf-8,Test 0\nTest 1\nTest 2\nTest 3';

     // Create a link element
     const link = document.createElement('a');
     link.href = encodeURI(csvContent);
     link.download = 'format.csv';

     // Append the link to the body
     document.body.appendChild(link);

     // Programmatically click the link to trigger the download
     link.click();

     // Remove the link from the document
     document.body.removeChild(link);

  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(date)

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
                  {initialTodo ? "Edit Task" : "Upload Tests"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <p className='pb-5'>
                  Upload your &quot;.csv&quot; file here containing your tests. To see a sample format, click the &quot;Sample File Format&quot; button below.
                  </p>
                  <div className="flex space-x-4 justify-center">
                      <button 
                        onClick={downloadFile}
                        className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer">
                          <Image src="/file.svg" width={10} height={10} className="w-5 h-5 mr-2" alt="Download Icon" />
                          Sample File Format
                      </button>

                     {/* Upload button */}
                    <div className="flex items-center justify-center">
                      <label className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer">
                        <Image src="/upload2.svg" width={10} height={10} className="w-5 h-5 mr-2" alt="Upload Icon" />
                        <span>Upload File</span>
                      </label>
                      <input id="file-upload" type="file" className="hidden" onChange={handleUpload} />
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
                        Complete Task
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
                      {initialTodo ? "Save Changes" : "Done"}
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

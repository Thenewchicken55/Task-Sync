import React, { useState } from 'react';
import Image from "next/image";
import { Todo } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

interface FileUploadProps {
  addTodoHandler: (todo: Todo) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ addTodoHandler }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<String []>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setSelectedFile(fileList[0]);
    } else {
      setSelectedFile(null); // Clear the state if no file selected
    }

    const file = event.target.files[0]; // Get the file
    const reader = new FileReader(); // Create a FileReader instance

    reader.onload = (e) => {
        const text = e.target.result; // The file content will be here
        const lines = (text as string).split('\n');
        // console.log(text);
        setFileData(lines);
    };

    reader.readAsText(file); // Read the file as text

  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log(fileData);

    fileData.forEach((title) => {
      console.log(title);
      // Only add if the title isn’t just empty spaces
      if (title.trim()) {
        const todo: Todo = {
          id: uuidv4(),
          title: title.trim(),
          description: "",      // set default or additional properties as needed
          date: "",             // could be a default date or left empty
          completed: false,
          isRecurring: false,
          recurrenceType: undefined,
          priority: undefined,
        };
        addTodoHandler(todo);
      }
  });

  };


  return (
    <div className="flex space-x-4 justify-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv,.txt" // Specify file types
        className='inline-flex items-center bg-white text-gray'
      />
      <button onClick={handleUpload} disabled={!selectedFile} className='inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer'>
        <Image src="/upload2.svg" width={10} height={10} className="w-5 h-5 mr-2" alt="Upload Icon" />
        Upload
      </button>
    </div>
  );
};

export default FileUpload;

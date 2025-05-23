"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventDropArg, EventClickArg } from "@fullcalendar/core";
import { Todo } from "../types/todo";
import AddTodoModal from "./AddTodoModal";
import ExportDates from "../components/ExportDates";

interface CalendarProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export default function Calendar({ todos, setTodos }: CalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setSelectedTodo(null);
    setIsModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const originalId =
      clickInfo.event.extendedProps.originalId || clickInfo.event.id;
    const todo = todos.find((t) => t.id === originalId);
    if (todo) {
      setSelectedTodo(todo);
      setIsModalOpen(true);
    }
  };

  // used when you move an event
  const handleEventDrop = (info: EventDropArg) => {
    const { event } = info;
    const originalId = event.extendedProps.originalId || event.id;
    const todo = todos.find((t) => t.id === originalId);
    
    if (todo && event.start) {
      const newDate = new Date(event.start);
      const formattedDate = newDate.toISOString().split("T")[0];

      const updatedTodos = todos.map((t) => {
        if (t.id === originalId) {
          return {
            ...t,
            date: formattedDate,
            endDate: formattedDate,
            duration: 1,
          };
        }
        return t;
      });
      setTodos(updatedTodos);
    }
  };

  // add new task through calendar
  const handleAddTodo = (todo: Todo) => {
    console.log(todo);

    if (selectedTodo) {
      const updatedTodos = todos.map((t) => (t.id === todo.id ? todo : t));
      setTodos(updatedTodos);
    } else {
      const newTodo: Todo = {
        ...todo,
        date: selectedDate || todo.date,
      };
      setTodos([...todos, newTodo]);
    }
    setIsModalOpen(false);
    setSelectedDate("");
    setSelectedTodo(null);
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
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const generateRecurringEvents = (todo: Todo) => {
    if (!todo.isRecurring || !todo.date) return [];

    const events = [];
    const startDate = new Date(todo.date);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    if (todo.recurrenceType === "daily") {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        events.push({
          id: `${todo.id}-${currentDate.toISOString().split("T")[0]}`,
          title: todo.title,
          start: currentDate.toISOString().split("T")[0],
          allDay: true,
          backgroundColor: "#374151",
          borderColor: "transparent",
          textColor: "#FFFFFF",
          extendedProps: { originalId: todo.id },
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (todo.recurrenceType === "weekly" && todo.recurrenceDays) {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (todo.recurrenceDays.includes(currentDate.getDay())) {
          events.push({
            id: `${todo.id}-${currentDate.toISOString().split("T")[0]}`,
            title: todo.title,
            start: currentDate.toISOString().split("T")[0],
            allDay: true,
            backgroundColor: "#374151",
            borderColor: "transparent",
            textColor: "#FFFFFF",
            extendedProps: { originalId: todo.id },
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return events;
  };

const allEvents = [];
todos.forEach((todo) => {
  if (!todo.completed) {
    allEvents.push({ title: todo.title, start: todo.date });
  }
});

  // used when you drop an event from the test list
  const handleDrop = (info) => {
    const { date, draggedEl } = info;
    const todoId = draggedEl.getAttribute("data-todo-id");
    console.log(info);

    if (todoId) {
      const todo = todos.find((t) => t.id === todoId);
      if (todo) {
        // Format the date to ensure we're using the correct date
        const formattedDate = date.toISOString().split("T")[0];

        const updatedTodos = todos.map((t) => {
          if (t.id === todoId) {
            return {
              ...t,
              date: formattedDate,
              endDate: formattedDate,
              duration: 1,
            };
          }
          return t;
        });
        setTodos(updatedTodos);
      }
    }
  };

  const handleDragevent = (info) => {
    console.log("HIIIIIIIIIII");
    const eventEl = info.el;
    const rect = eventEl.getBoundingClientRect();
    const x = rect.width;
    const y = rect.height;
    (info.jsEvent as DragEvent).dataTransfer?.setDragImage(eventEl, x, y);
    // Calculate the new date (same day next week)
    const event = info.event;
    const newStartDate = new Date(event.start);
    newStartDate.setDate(newStartDate.getDate() + 7);
    const newEndDate = new Date(event.end);
    newEndDate.setDate(newEndDate.getDate() + 7);
    // Update the event's start and end dates
    event.setStart(newStartDate);
    event.setEnd(newEndDate);

    console.log("New Date set");
    console.log(event);

    event.setExtendedProp("width", rect.width);
    event.setExtendedProp("height", rect.height);
    event.setExtendedProp("x", rect.left);
    event.setExtendedProp("y", rect.top);

    const eventID = event.extendedProps.originalId  || event.id;
    const todo = todos.find((t) => t.id === eventID);
    console.log("Tryna update the event lowkey");
    if (todo && event.start) {
      const updatedTodos = todos.map((t) => {
        if (t.id === eventID) {
          return {
            ...t,
            isRecurring: false,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          };
        }
        return t;
      });
      setTodos(updatedTodos);
    }
        
  };

  const handleCellHover = (info) => {
    const cell = info.el;
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
      cell.classList.add("bg-blue-50");
    });
    cell.addEventListener("dragleave", () => {
      cell.classList.remove("bg-blue-50");
    });
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      cell.classList.remove("bg-blue-50");
    });
  };

  const handleEventResize = (info ) => {

    const event = info.event;
    const eventID = event.extendedProps.originalId  || event.id;
    const todo = todos.find((t) => t.id === eventID);
    if (todo && event.start) {
      const updatedTodos = todos.map((t) => {
        if (t.id === eventID) {
          return {
            ...t,
            title: todo.title,
            isRecurring: false,
            end: event.end,
            endDate: "" + (event.end.getMonth() + 1) + "/" + (event.end.getDate() - 1) + "/" + event.end.getFullYear(),
            duration: event.end.getDate() - event.start.getDate(),
          };
        }
        return t;
      });
      setTodos(updatedTodos);
    }
  };

  return (
    <div className="h-full [&_.fc-button]:!bg-gray-800 [&_.fc-button]:!text-white 
    [&_.fc-button]:!border-gray-800 [&_.fc-button:hover]:!bg-gray-700 
    [&_.fc-button-active]:!bg-gray-900 [&_.fc-button-active]:!text-white [&_.fc-event]:!bg-gray-700 
    [&_.fc-event]:!border-transparent [&_.fc-event]:!text-white [&_.fc-toolbar-title]:!font-semibold 
    [&_.fc-event-dragging]:!opacity-50 [&_.fc-event-dragging]:!cursor-grabbing [&_.fc-button]:!cursor-pointer">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "today",
          center: "title",
          right: "prev,next",
        }}
        buttonText={{
          today: "Today",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekNumbers={true}
        weekends={true}
        droppable={true}
        eventResizableFromStart={true}
        eventDurationEditable={true}
        // events={allEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        drop={handleDrop}
        // eventDragStart={handleDragevent}
        dayCellDidMount={handleCellHover}
        eventResize={handleEventResize}
        weekNumberFormat={{week: "numeric"}}
      />
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTodo(null);
          setSelectedDate("");
        }}
        onAdd={handleAddTodo}
        onComplete={handleComplete}
        initialTodo={selectedTodo}
      />
      <div className="justify-center items-center p-10">
        <ExportDates
        allTasks={todos} />
      </div>

    </div>
  );
}

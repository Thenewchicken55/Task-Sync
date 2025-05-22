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
            width: todo.width,
            height: todo.height,
            x: todo.x,
            y: todo.y,
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

// const allEvents = todos.filter(
//   (todo, index, self) =>
//     index === self.findIndex((t) => t.title === todo.title && t.date === todo.date)
// ).filter((todo) => !todo.completed);

  // all events on the calendar
  // const allEvents = todos
  //   .filter((todo) => !todo.completed)
  //   .flatMap((todo) => {
  //     console.log("todos!");
  //     console.log(todos);
  //     if (todo.isRecurring) {
  //       return generateRecurringEvents(todo);
  //     } else {
  //       // const events = [
  //       //   {
  //       //     id: todo.id,
  //       //     title: todo.title,
  //       //     start: todo.date,
  //       //     end: todo.endDate || todo.date,
  //       //     allDay: true,
  //       //     backgroundColor: "#374151",
  //       //     borderColor: "transparent",
  //       //     textColor: "#FFFFFF",
  //       //     width: todo.width,
  //       //     height: todo.height,
  //       //     x: todo.x,
  //       //     y: todo.y,
  //       //     Object: todo.Object,
  //       //   },
  //       // ];
  //       const events = [
  //         {
  //           // id: todo.id,
  //           title: todo.title,
  //           start: todo.date,
  //           // end: todo.endDate || todo.date,
  //           allDay: true,
  //           backgroundColor: "#374151",
  //           borderColor: "transparent",
  //           textColor: "#FFFFFF",
  //           width: todo.width,
  //           height: todo.height,
  //           x: todo.x,
  //           y: todo.y,
  //           shape: todo.shape,
  //           // Object: todo.Object,
  //         },
  //       ];

  //       return events;
  //     }
  //     return [];
  //   });
  const allEvents = todos
    .filter((todo) => !todo.completed)
    .flatMap((todo) => {
      console.log("todos!");
      console.log(todos);
        const events = [
          {
            // id: todo.id,
            title: todo.title,
            start: todo.date,
            // end: todo.endDate || todo.date,
            allDay: true,
            backgroundColor: "#374151",
            borderColor: "transparent",
            textColor: "#FFFFFF",
            width: todo.width,
            height: todo.height,
            x: todo.x,
            y: todo.y,
            shape: todo.shape,
            // Object: todo.Object,
          },
        ];
        return events;
    });
  // const allEvents = todos
  //   .filter((todo) => !todo.completed)
  //   .map((todo) => {
  //     console.log("todos!");
  //     console.log(todos);
  //     if (todo.isRecurring) {
  //       return generateRecurringEvents(todo);
  //     } else {
  //       return [
  //         {
  //           // id: todo.id,
  //           title: todo.title,
  //           start: todo.date,
  //           // end: todo.endDate || todo.date,
  //           allDay: true,
  //           backgroundColor: "#374151",
  //           borderColor: "transparent",
  //           textColor: "#FFFFFF",
  //           width: todo.width,
  //           height: todo.height,
  //           x: todo.x,
  //           y: todo.y,
  //           shape: todo.shape,
  //           // Object: todo.Object,
  //         },
  //       ];

  //       }
  //     return [];
  //   })
  //   .flatMap(events => events)
  //   ;
  

//   const allEvents = [
//   { title: 'Meeting', start: new Date() }
// ]

// a custom render function
function renderEventContent(eventInfo) {
  const eventTitle = eventInfo.event.title;

  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

// function trimAll(info) {
//   return Object.assign({}. info)
//   .map((value, key) => {
//     if (key === 'event' && value?.title) {
//       const title = value.title;
//       // const newTitle = title 
//     }
//   })
// };

  const handleDrop = (info: { date: Date; draggedEl: HTMLElement }) => {
    const { date, draggedEl } = info;
    const todoId = draggedEl.getAttribute("data-todo-id");

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

  const handleEventResize = (info) => {
    // e.preventDefault();
    const rect = info.el.getBoundingClientRect();

    const event = info.event;
    const eventID = event.extendedProps.originalId  || event.id;
    const todo = todos.find((t) => t.id === eventID);

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
            end: event.end,
            shape: rect,
            // duration: ?
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
        // maxEventsPerDay={true}
        weekends={true}
        droppable={true}
        // draggable={true}
        events={allEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        drop={handleDrop}
        // eventDragStart={handleDragevent}
        dayCellDidMount={handleCellHover}
        eventResize={handleEventResize}
        eventContent={renderEventContent}
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

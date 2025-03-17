import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, isToday, getMonth, getYear, isValid } from "date-fns";
import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openEventModal } from "@/features/eventModal/eventModalSlice";
import Event from "@/components/Event/Event";

function MonthCalendar() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const { currentDate } = useOutletContext();
  const { year, month: mParam, day } = useParams();
  const dispatch = useDispatch();

  // Build a date from route params if they exist
  let routeDate = new Date(year, (mParam || 1) - 1, day || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  const month = useMemo(() => getMonth(finalDate), [finalDate]);
  const yearNum = useMemo(() => getYear(finalDate), [finalDate]);

  // Compute the array of days using finalDate's month & year
  const days = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(new Date(yearNum, month)));
    const endDate = endOfWeek(endOfMonth(new Date(yearNum, month)));
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [yearNum, month]);

  const events = JSON.parse(localStorage.getItem("events")) || [];

  // Opens the event modal to add new event
  function handleClick(day) {
    dispatch(
      openEventModal({
        modalType: "add",
        eventInfo: {
          eventDate: format(day, "yyyy-MM-dd"),
        },
      })
    );
  }

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-700 bg-gray-100 p-2">
        {weekdays.map((wd, index) => (
          <div key={index} className="p-3">{wd}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 border border-gray-300">
        {days.map((dayObj, index) => {
          const cellDate = format(dayObj, "yyyy-MM-dd");
          const cellEvents = events.filter((evt) => evt.eventDate === cellDate);

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-start h-35 border border-gray-200
                ${dayObj.getMonth() !== month ? "text-gray-400" : "text-black"}`}
              onClick={() => handleClick(dayObj)}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  isToday(dayObj) ? "bg-blue-500 text-white font-bold" : ""
                }`}
              >
                {format(dayObj, "d")}
              </span>

              {/* Event Container */}
              <div className="mt-1 rounded-md mb-1 cursor-pointer w-[calc(100%-0.5rem)] overflow-scroll">
                {cellEvents.map((event) => (
                  <div key={event.eventId}>
                    <Event event={event} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthCalendar;

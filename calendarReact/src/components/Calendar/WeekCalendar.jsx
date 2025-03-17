import { useMemo } from "react";
import { startOfWeek, format, isToday, isValid, } from "date-fns";
import { useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { openEventModal } from "@/features/eventModal/eventModalSlice";
import Event from "@/components/Event/Event";

// Group overlapping events by comparing their start/end times.
function calculateOverlaps(events) {
  if (!events || events.length === 0) return [];

  // Sort by start time so we process events in ascending order
  events.sort((a, b) => a.eventStartTime.localeCompare(b.eventStartTime));

  let activeEvents = [];
  let groupedEvents = [];

  events.forEach((event) => {
    // Remove any events from `activeEvents` that ended before this event's start
    activeEvents = activeEvents.filter(
      (e) => e.eventEndTime > event.eventStartTime
    );
    activeEvents.push(event);

    // eventIndex = position in the activeEvents array
    // overlapCount = how many events are active at the same time
    // groupIndex = index to identify this "batch"
    groupedEvents.push({
      ...event,
      eventIndex: activeEvents.findIndex((e) => e.eventId === event.eventId),
      overlapCount: activeEvents.length,
      groupIndex: groupedEvents.length,
    });
  });

  return groupedEvents;
}

function WeekCalendar() {
  const dispatch = useDispatch();
  const { currentDate } = useOutletContext();
  const { year, month, day } = useParams();

  // Build a date from route params if they exist
  let routeDate = new Date(year, (month || 1) - 1, day || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  // Compute the start of the week
  const weekStart = useMemo(
    () => startOfWeek(finalDate, { weekStartsOn: 0 }),
    [finalDate]
  );


  // Build an array of the 7 days in that week.
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayObj = new Date(weekStart);
      dayObj.setDate(weekStart.getDate() + i);
      return dayObj;
    });
  }, [weekStart]);


  const hours = Array.from({ length: 24 }, (_, i) => i);
  const events = JSON.parse(localStorage.getItem("events")) || [];

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {/* --- Weekdays Header --- */}
      <div className="flex border-b border-gray-200">
        {/* An empty cell for the hour labels */}
        <div className="w-16 border-r border-gray-200"></div>

        {days.map((dayObj, index) => (
          <div
            key={index}
            className={
              "flex-1 border-r border-gray-200 p-2 text-center text-xs font-semibold " +
              (isToday(dayObj) ? "bg-blue-500 text-white font-bold" : "text-gray-700")
            }
          >
            <div>{format(dayObj, "EEE")}</div>
            <div>{format(dayObj, "d MMM")}</div>
          </div>
        ))}
      </div>

      {/* --- Hour Rows  --- */}
      {hours.map((hour) => {
        // For display only
        const formattedHourLabel =
          hour === 0
            ? "12 AM"
            : hour < 12
              ? `${hour} AM`
              : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;

        return (
          <div key={hour} className="flex border-b border-gray-200 h-16">
            {/* Hour Label column */}
            <div className="w-16 border-r border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            {/* 7 Day columns for this hour */}
            {days.map((dayObj, idx) => {
              const cellDate = format(dayObj, "yyyy-MM-dd");

              // Filter to only the events that match this date
              const dayEvents = events.filter(e => e.eventDate === cellDate);

              // Filter further to only events that start in this hour
              const slotEvents = dayEvents.filter(evt => {
                const eventHour = parseInt(evt.eventStartTime.split(":")[0], 10);
                return eventHour === hour;
              });

              // Overlap logic
              const overlappedEvents = calculateOverlaps(slotEvents);

              // Handler for adding a new event
              const handleSlotClick = () => {
                const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                dispatch(
                  openEventModal({
                    modalType: "add",
                    eventInfo: {
                      eventDate: cellDate,
                      eventStartTime: formattedStartTime,
                    },
                  })
                );
              };

              return (
                <div
                  key={idx}
                  className="flex-1 border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer relative"
                  onClick={handleSlotClick}
                >
                  <div className="mt-1 px-1 overflow-y-auto max-h-full">
                    {overlappedEvents.map((evt) => (
                      <div key={evt.eventId} className="mb-1">
                        <Event
                          event={evt}
                          overlapCount={evt.overlapCount}
                          eventIndex={evt.eventIndex}
                          groupIndex={evt.groupIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default WeekCalendar;

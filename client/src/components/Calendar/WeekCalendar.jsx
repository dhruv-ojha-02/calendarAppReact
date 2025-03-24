import React, { useEffect, useMemo } from "react";
import { startOfWeek, format, isToday, isValid } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { openEventModal, getEvents } from "@/features/eventModal/eventModalSlice";
import Event from "@/components/Event/Event";
import { MODAL_TYPE_ADD } from "@/constants";

// Group overlapping events by comparing their start/end times.
function calculateOverlaps(events) {
  if (!events || events.length === 0) return [];

  // Sort by start time so we process events in ascending order
  events.sort((a, b) => a.eventStartTime.localeCompare(b.eventStartTime));

  let activeEvents = [];
  let groupedEvents = [];

  events.forEach((event) => {
    // Remove events from `activeEvents` that ended before this event’s start
    activeEvents = activeEvents.filter(
      (e) => e.eventEndTime > event.eventStartTime
    );
    activeEvents.push(event);

    // eventIndex = position in activeEvents
    // overlapCount = how many events are active
    // groupIndex = index to identify group
    groupedEvents.push({
      ...event,
      eventIndex: activeEvents.findIndex((e) => e._id === event._id),
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

  let routeDate = new Date(year, (month || 1) - 1, day || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  // Fetch events from Redux
  const events = useSelector((state) => state.eventModal.events);

  // Load all events from the server
  useEffect(() => {
    dispatch(getEvents());
  }, []);

  // Compute the start of the week from finalDate
  const weekStart = useMemo(
    () => startOfWeek(finalDate, { weekStartsOn: 0 }),
    [finalDate]
  );

  // Array of the 7 days in that week
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayObj = new Date(weekStart);
      dayObj.setDate(weekStart.getDate() + i);
      return dayObj;
    });
  }, [weekStart]);

  // Array of 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Handler for adding a new event in a given day/hour
  const handleSlotClick = (dayStr, hour) => {
    const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    dispatch(
      openEventModal({
        modalType: MODAL_TYPE_ADD,
        eventInfo: {
          eventDate: dayStr,
          eventStartTime: formattedStartTime,
        },
      })
    );
  };

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {/* --- Weekdays Header --- */}
      <div className="flex border-b border-gray-200">
        {/* Empty cell for hour labels */}
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

      {hours.map((hour) => {
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
            {/* Hour Label Column */}
            <div className="w-16 border-r border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            {/* 7 Day columns for this hour */}
            {days.map((dayObj, idx) => {
              const cellDate = format(dayObj, "yyyy-MM-dd");

              // Filter events for this day
              const dayEvents = events.filter(
                (evt) => evt.eventDate === cellDate
              );

              // Further filter to events that start in this hour
              const slotEvents = dayEvents.filter((evt) => {
                const eventHour = parseInt(evt.eventStartTime.split(":")[0], 10);
                return eventHour === hour;
              });

              // Overlap logic
              const overlappedEvents = calculateOverlaps(slotEvents);

              return (
                <div
                  key={idx}
                  className="flex-1 border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer relative"
                  onClick={() => handleSlotClick(cellDate, hour)}
                >
                  <div className="mt-1 px-1 overflow-y-auto max-h-full">
                    {overlappedEvents.map((evt) => (
                      <div key={evt._id} className="mb-1">
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

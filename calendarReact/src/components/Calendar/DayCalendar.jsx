import { format, isValid } from "date-fns";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
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
    // Remove any events that ended before this event’s start
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

function DayCalendar() {
  const dispatch = useDispatch();
  const { currentDate } = useOutletContext();
  const { year, month, day } = useParams();

  // Build a date from route params if they exist
  let routeDate = new Date(year, (month || 1) - 1, day || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  // Format as "yyyy-MM-dd" for filtering events
  const formattedDate = useMemo(
    () => format(finalDate, "yyyy-MM-dd"),
    [finalDate]
  );

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const events = JSON.parse(localStorage.getItem("events")) || [];

  // Filter to only events that match this finalDate
  const dayEvents = useMemo(
    () => events.filter((evt) => evt.eventDate === formattedDate),
    [events, formattedDate]
  );

  // When user clicks a time slot, open a new event modal
  const handleSlotClick = (hour) => {
    const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    dispatch(
      openEventModal({
        modalType: "add",
        eventInfo: {
          eventDate: formattedDate,
          eventStartTime: formattedStartTime,
        },
      })
    );
  };

  return (
    <div className="flex flex-col flex-1 mt-18.5">
      {hours.map((hour) => {
        const formattedHourLabel =
          hour === 0
            ? "12 AM"
            : hour < 12
              ? `${hour} AM`
              : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`;

        // Find events that start in this hour
        const slotEvents = dayEvents.filter(
          (evt) => parseInt(evt.eventStartTime.split(":")[0], 10) === hour
        );

        // Overlap logic
        const overlappedEvents = calculateOverlaps(slotEvents);

        return (
          <div key={hour} className="flex border-b border-gray-200 h-16">
            {/* Time Label */}
            <div className="w-16 border-r border-gray-200 flex items-center justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            {/* Slot area */}
            <div
              className="flex-1 relative bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSlotClick(hour)}
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
          </div>
        );
      })}
    </div>
  );
}

export default DayCalendar;

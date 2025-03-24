import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import { getEvents, openEventModal } from "@/features/eventModal/eventModalSlice";
import { MODAL_TYPE_ADD } from "@/constants";
import Event from "@/components/Event/Event";

// // Group overlapping events by comparing their start/end times.
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

function DayCalendar() {
  const dispatch = useDispatch();
  const { currentDate } = useOutletContext();

  const { year, month, day } = useParams();

  // Fetch events from Redux
  const events = useSelector((state) => state.eventModal.events);

  // Load all events from the server
  useEffect(() => {
    dispatch(getEvents());
  }, []);

  // Build a Date from route params if exists
  const routeDate = new Date(year, (month || 1) - 1, day || 1);
  const finalDate = isValid(routeDate) ? routeDate : currentDate;

  const formattedDate = useMemo(
    () => format(finalDate, "yyyy-MM-dd"),
    [finalDate]
  );

  // Array of 24 hours for the day
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  // Filter the events to only those matching the current day
  const dayEvents = useMemo(
    () => events.filter((evt) => evt.eventDate === formattedDate),
    [events, formattedDate]
  );

  // Open the Add Event Modal
  const handleSlotClick = (hour) => {
    const formattedStartTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    dispatch(
      openEventModal({
        modalType: MODAL_TYPE_ADD,
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

        // Overlapping events logic
        const overlappedEvents = calculateOverlaps(slotEvents);

        return (
          <div key={hour} className="flex border-b border-gray-200 h-16">
            {/* Hour label */}
            <div className="w-16 border-r border-gray-200 flex items-center justify-end pr-2 text-xs text-gray-500">
              {formattedHourLabel}
            </div>

            {/* Main slot area for the hour */}
            <div
              className="flex-1 relative bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSlotClick(hour)}
            >
              {/* Container for events in this slot */}
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
          </div>
        );
      })}
    </div>
  );
}

export default DayCalendar;

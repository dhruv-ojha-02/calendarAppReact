import { useDispatch } from "react-redux";
import { openEventModal } from "@/features/eventModal/eventModalSlice";
import { useOutletContext } from "react-router-dom";

function Event({ event, overlapCount, eventIndex, groupIndex = 0 }) {
    const dispatch = useDispatch();
    const { viewType } = useOutletContext();

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(
            openEventModal({
                modalType: "display",
                eventInfo: event,
            })
        );
    };

    if (viewType === "month") {
        return (
            <div
                className="bg-blue-400 text-white z-10 p-1 text-xs text-center font-semibold rounded-md mb-1 w-[calc(100%-0.5rem)] overflow-hidden whitespace-nowrap text-ellipsis hover:bg-blue-500 border border-white cursor-pointer"
                onClick={handleClick}
            >
                <p>{event.eventTitle}</p>
            </div>
        );
    }

    const [startHour, startMinute] = event.eventStartTime.split(":").map(Number);
    const [endHour, endMinute] = event.eventEndTime.split(":").map(Number);
    let durationMinute, durationHour;
    if (endMinute >= startMinute) {
        durationMinute = endMinute - startMinute;
        durationHour = endHour - startHour;
    } else {
        durationMinute = 60 + (endMinute - startMinute);
        durationHour = endHour - startHour - 1;
    }
    const topPosition = startMinute * (63 / 60);  // Each hour slot is 63px in height
    const height = durationHour * 63 + durationMinute * (63 / 60);
    const eventWidth = overlapCount > 1 ? `${95 / overlapCount}%` : "95%";
    const leftOffset = overlapCount > 1 ? `${eventIndex * (95 / overlapCount)}%` : "0%";
    const zIndex = 1 + groupIndex * 10;

    return (
        <div
            className={`bg-blue-400 text-white absolute rounded-lg cursor-pointer overflow-hidden hover:bg-blue-500 p-2 border border-white`}
            style={{
                top: `${topPosition}px`,
                height: `${height}px`,
                width: eventWidth,
                left: leftOffset,
                zIndex: zIndex,
            }}
            onClick={handleClick}
            title={`${event.eventTitle} (${event.eventAttendees})`}
        >
            <p className="text-xs font-semibold overflow-hidden whitespace-nowrap text-truncate">
                {event.eventTitle}
                <br />
                {event.eventAttendees}
            </p>
        </div>
    );
}

export default Event;




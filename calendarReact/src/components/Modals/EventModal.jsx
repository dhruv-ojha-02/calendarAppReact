import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeEventModal, editEvent, saveEvent } from "@/features/eventModal/eventModalSlice";

function EventModal({ onClose }) {
  const eventModal = useSelector((state) => state.eventModal);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: eventModal.eventTitle,
      date: eventModal.eventDate,
      startTime: eventModal.eventStartTime,
      endTime: eventModal.eventEndTime,
      attendees: eventModal.eventAttendees,
    }
  });

  function onSubmit(eventData) {
    if (eventModal.modalType === "edit"){ 
      dispatch(editEvent({
        eventId: eventModal.eventId,
        updatedData: {
          eventTitle: eventData.title,
          eventDate: eventData.date,
          eventStartTime: eventData.startTime,
          eventEndTime: eventData.endTime,
          eventAttendees: eventData.attendees,
        },
      }))
    }
    else if (eventModal.modalType === "add") {
      dispatch(saveEvent({
        eventId: Date.now(),
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventStartTime: eventData.startTime,
        eventEndTime: eventData.endTime,
        eventAttendees: eventData.attendees,
      }))
    }
    dispatch(closeEventModal());
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900 opacity-30"
        onClick={onClose}
      />

      {/* Event Modal */}
      <div className="relative bg-gray-100 p-6 rounded-lg shadow-lg w-96 z-10">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4">{eventModal.modalType === "add" ? "Add New" : "Edit"} Event</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block font-bold mb-1">Title</label>
            <input
              {...register("title", { required: "Event title is mandatory" })}
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500 font-bold">{errors.title.message}</p>
            )}
          </div>
          {/* Date Field */}
          <div className="mb-4">
            <label className="block font-bold mb-1">Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is mandatory" })}
              className="w-full p-2 border rounded"
            />
            {errors.date && (
              <p className="text-red-500 font-bold">{errors.date.message}</p>
            )}
          </div>
          {/* Start Time and End Time */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block font-bold mb-1">Start Time</label>
              <input
                type="time"
                {...register("startTime", { required: "Start time is mandatory" })}
                className="w-full p-2 border rounded"
              />
              {errors.startTime && (
                <p className="text-red-500 font-bold">{errors.startTime.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block font-bold mb-1">End Time</label>
              <input
                type="time"
                {...register("endTime", {
                  required: "End time is mandatory",
                  validate: (value) => {
                    const startTime = getValues("startTime");
                    return startTime && value > startTime
                      ? true
                      : "End time must be after start time";
                  },
                })}
                className="w-full p-2 border rounded"
              />
              {errors.endTime && (
                <p className="text-red-500 font-bold">{errors.endTime.message}</p>
              )}
            </div>
          </div>
          {/* Attendees Field */}
          <div className="mb-12">
            <label className="block font-bold mb-1">Attendees</label>
            <input
              {...register("attendees", { required: "Attendees is mandatory" })}
              className="w-full p-2 border rounded"
            />
            {errors.attendees && (
              <p className="text-red-500 font-bold">{errors.attendees.message}</p>
            )}
          </div>
          {/* Save Button at bottom right */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEventModal, deleteEvent, openEventModal } from "@/features/eventModal/eventModalSlice";

function EventDetailsModal({ onClose }) {
  const dispatch = useDispatch();
  const eventModal = useSelector((state) => state.eventModal);

  function onEdit() {
    dispatch(openEventModal({
        modalType: "edit",
        eventInfo: {
          eventId: eventModal.eventId,
          eventTitle: eventModal.eventTitle,
          eventDate: eventModal.eventDate,
          eventStartTime: eventModal.eventStartTime,
          eventEndTime: eventModal.eventEndTime,
          eventAttendees: eventModal.eventAttendees,
        },
      })
    );
  }

  function onDelete(){
    dispatch(deleteEvent({
      eventId: eventModal.eventId,
    }))
    dispatch(closeEventModal());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900 opacity-30" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-gray-100 p-6 rounded-lg shadow-lg w-96 z-40">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-5">Event Details</h2>

        {/* Event Details */}
        <div className="space-y-4">
          <div className="overflow-hidden whitespace-nowrap text-ellipsis">
            <span className="font-bold">Title: </span>
            {eventModal.eventTitle}
          </div>
          <div>
            <span className="font-bold">Date: </span>
            {eventModal.eventDate}
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <span className="font-bold">Start Time: </span>
              {eventModal.eventStartTime}
            </div>
            <div className="w-1/2">
              <span className="font-bold">End Time: </span>
              {eventModal.eventEndTime}
            </div>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-ellipsis">
            <span className="font-bold">Attendees: </span>
            {eventModal.eventAttendees}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onEdit}
            className="bg-green-500 w-20 text-white py-2 px-4 rounded-full hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;

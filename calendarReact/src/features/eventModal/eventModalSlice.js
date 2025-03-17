import { createSlice } from "@reduxjs/toolkit";

const eventModalSlice = createSlice({
    name: "eventModal",
    initialState: {
        eventId: null,
        eventTitle: "",
        eventDate: "",
        eventStartTime: "",
        eventEndTime: "",
        eventAttendees: "",
        isModalOpen: false,
        modalType: "add", //add, edit, details modals
    },
    reducers: {
        openEventModal: (state, action) => {
            state.isModalOpen = true;
            state.modalType = action.payload.modalType;
            if (action.payload.eventInfo) {
                state.eventId = action.payload.eventInfo.eventId;
                state.eventTitle = action.payload.eventInfo.eventTitle;
                state.eventDate = action.payload.eventInfo.eventDate;
                state.eventStartTime = action.payload.eventInfo.eventStartTime;
                state.eventEndTime = action.payload.eventInfo.eventEndTime;
                state.eventAttendees = action.payload.eventInfo.eventAttendees;
            }
        },
        closeEventModal: (state) => {
            state.isModalOpen = false;
            state.eventId = null;
            state.eventTitle = "";
            state.eventDate = "";
            state.eventStartTime = "";
            state.eventEndTime = "";
            state.eventAttendees = "";
        },
        setEventTitle: (state, action) => {
            state.eventTitle = action.payload.eventTitle;
        },
        setEventDate: (state, action) => {
            state.eventDate = action.payload.eventDate;
        },
        setEventStartTime: (state, action) => {
            state.eventStartTime = action.payload.eventStartTime;
        },
        setEventEndTime: (state, action) => {
            state.eventEndTime = action.payload.eventEndTime;
        },
        setEventAttendees: (state, action) => {
            state.eventAttendees = action.payload.eventAttendees;
        },
        saveEvent: (state, action) => {
            const { eventTitle, eventDate, eventStartTime, eventEndTime, eventAttendees } = action.payload;
            const events = JSON.parse(localStorage.getItem("events")) || [];

            const event = {
                eventId: state.eventId || Date.now(),
                eventTitle: eventTitle,
                eventDate: eventDate,
                eventStartTime: eventStartTime,
                eventEndTime: eventEndTime,
                eventAttendees: eventAttendees,
            }
            events.push(event);
            localStorage.setItem("events", JSON.stringify(events));
        },
        editEvent: (state, action) => {
            let events = localStorage.getItem("events") ?
                JSON.parse(localStorage.getItem("events")) : [];
            events = events.map((event) =>
                event.eventId === action.payload.eventId
                    ? { ...event, ...action.payload.updatedData }
                    : event
            );
            localStorage.setItem("events", JSON.stringify(events));
        },
        deleteEvent: (state, action) => {
            const events = localStorage.getItem("events") ?
                JSON.parse(localStorage.getItem("events")) : [];

            const index = events.findIndex(event => event.eventId === action.payload.eventId);
            if (index !== -1) {
                events.splice(index, 1);
                localStorage.setItem("events", JSON.stringify(events));
            }
        }
    }
});

export const {
    openEventModal,
    closeEventModal,
    setEventName,
    setEventDate,
    setEventAttendees,
    setEventStartTime,
    setEventEndTime,
    saveEvent,
    editEvent,
    deleteEvent,
} = eventModalSlice.actions;

export default eventModalSlice.reducer;

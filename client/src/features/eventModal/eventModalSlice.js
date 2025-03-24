import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "@/api/api";
import { MODAL_TYPE_ADD } from "@/constants";

// Async thunks for API calls
export const getEvents = createAsyncThunk("events/getEvents", async () => {
    return await fetchEvents();
});

export const addEvent = createAsyncThunk("events/addEvent", async (eventData) => {
    return await createEvent(eventData);
});

export const editEvent = createAsyncThunk("events/editEvent", async ({ _id, updatedData }) => {
    return await updateEvent(_id, updatedData);
});

export const removeEvent = createAsyncThunk("events/removeEvent", async (_id) => {
    await deleteEvent(_id);
    return _id;
});

const eventModalSlice = createSlice({
    name: "eventModal",
    initialState: {
        events: [],
        _id: null,
        eventTitle: "",
        eventDate: "",
        eventStartTime: "",
        eventEndTime: "",
        eventAttendees: "",
        isModalOpen: false,
        modalType: MODAL_TYPE_ADD,  // Possible values: add, edit, display
        error: null,
    },

    reducers: {
        openEventModal: (state, action) => {
            state.isModalOpen = true;
            state.modalType = action.payload.modalType;
            if (action.payload.eventInfo) {
                state._id = action.payload.eventInfo._id;
                state.eventTitle = action.payload.eventInfo.eventTitle;
                state.eventDate = action.payload.eventInfo.eventDate;
                state.eventStartTime = action.payload.eventInfo.eventStartTime;
                state.eventEndTime = action.payload.eventInfo.eventEndTime;
                state.eventAttendees = action.payload.eventInfo.eventAttendees;
            }
        },
        closeEventModal: (state,action) => {
            state.isModalOpen = false;
            state._id = null;
            state.eventTitle = "";
            state.eventDate = "";
            state.eventStartTime = "";
            state.eventEndTime = "";
            state.eventAttendees = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetching events
            .addCase(getEvents.fulfilled, (state, action) => {
                state.events = action.payload;
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Add an event
            .addCase(addEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            // Edit an event
            .addCase(editEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            // Delete an event
            .addCase(removeEvent.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event._id !== action.payload);
            });
    }
});

export const { openEventModal, closeEventModal } = eventModalSlice.actions;
export default eventModalSlice.reducer;

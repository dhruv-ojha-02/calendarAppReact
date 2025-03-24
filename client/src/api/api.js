import { API_BASE_URL } from "@/constants";

export const fetchEvents = async () => {
    const res = await fetch(`${API_BASE_URL}/events`);
    return res.json();
};

export const createEvent = async (eventData) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(eventData)
    });
    return res.json();
};

export const updateEvent = async(_id, updatedData) => {
    const res = await fetch(`${API_BASE_URL}/events/${_id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedData)
    });
    return res.json();
}

export const deleteEvent = async(_id) => {
    await fetch( `${API_BASE_URL}/events/${_id}`,{
        method: "DELETE"
    });
}
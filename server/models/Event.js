const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventTitle: String,
    eventDate: String,
    eventStartTime: String, 
    eventEndTime: String, 
    eventAttendees: String,
});

module.exports = mongoose.model("Event", eventSchema);

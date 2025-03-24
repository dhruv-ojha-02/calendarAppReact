const express = require("express");
const Event = require("@models/Event");

const router = express.Router();

// Fetch events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    }
    catch (err){
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Create event
router.post("/events", async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.json(savedEvent);
    }
    catch (err){
        res.status(500).json({ error: "Failed to create event" });
    }
});

// Update/edit event
router.put("/events/:_id", async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params._id, req.body, { new: true });
        res.json(updatedEvent);
    }
    catch(err) {
        res.status(500).json({ error: "Failed to update event" });
    }
});

// Delete event
router.delete("/events/:_id", async(req,res)=>{
    try{
        await Event.findByIdAndDelete(req.params._id);
        res.json({ message: "Event deleted successfully" });
    }
    catch(err){
        res.status(500).json({error: "Failed to delete event"});
    }
});


module.exports = router;
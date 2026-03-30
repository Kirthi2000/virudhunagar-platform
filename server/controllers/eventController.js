const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, type, date, venue, link } = req.body;
    if (!title || !description || !type || !date)
      return res.status(400).json({ message: 'Title, description, type and date are required' });

    const event = await Event.create({
      title, description, type, date,
      venue: venue || '',
      link: link || '',
      postedBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const events = await Event.find(filter).sort({ date: 1 }).populate('postedBy', 'name role institution');
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('postedBy', 'name role institution');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isOwner = req.user.role === 'owner';
    const isAuthor = event.postedBy.toString() === req.user._id.toString();
    if (!isOwner && !isAuthor)
      return res.status(403).json({ message: 'Not authorized to delete this event' });

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

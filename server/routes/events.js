const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('institution', 'company', 'faculty', 'owner'), createEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;

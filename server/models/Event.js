const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Hackathon', 'Workshop', 'Seminar', 'Competition', 'Other'], required: true },
  date: { type: Date, required: true },
  venue: { type: String },
  link: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { url: String, public_id: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

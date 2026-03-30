const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  domain:      { type: String, required: true, enum: ['AI', 'IoT', 'Agriculture', 'Healthcare', 'Education', 'Environment', 'Other'] },
  technologies: [String],
  githubLink:  { type: String, default: '' },
  files:       [{ url: String, public_id: String, name: String }],
  images:      [{ url: String, public_id: String }],
  hasDataset:  { type: Boolean, default: false },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institution: { type: String, default: '' },
  ratings:     [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, stars: { type: Number, min: 1, max: 5 } }],
  avgRating:   { type: Number, default: 0 },
  totalRatings:{ type: Number, default: 0 },
  comments:    [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }],
  bookmarks:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

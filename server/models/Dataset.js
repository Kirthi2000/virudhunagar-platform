const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Agriculture', 'Water', 'Population', 'Industry', 'Education', 'Health', 'Other'] },
  file: { url: String, public_id: String },
  format: { type: String },
  size: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Dataset', datasetSchema);

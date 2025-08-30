import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  dateIssued: { type: String },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  tags: { type: [String], default: [] },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);



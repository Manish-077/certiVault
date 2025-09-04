import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  dateIssued: { type: Date },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);



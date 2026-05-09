import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  role:      String,
  quote:     { type: String, required: true },
  photo:     String,
  rating:    { type: Number, min: 1, max: 5, default: 5 },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isVisible: { type: Boolean, default: true },
  order:     { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);

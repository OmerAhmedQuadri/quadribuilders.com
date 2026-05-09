import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  slug:             { type: String, required: true, unique: true },
  type:             { type: String, enum: ['residential', 'commercial', 'contract', 'mixed-use'], required: true },
  status:           { type: String, enum: ['completed', 'ongoing', 'upcoming'], required: true },
  isListed:         { type: Boolean, default: false },
  price:            String,
  location:         String,
  area:             String,
  bedrooms:         Number,
  description:      String,
  shortDescription: String,
  images:           [String],
  features:         [String],
  isFeatured:       { type: Boolean, default: false },
  order:            { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Project', projectSchema);

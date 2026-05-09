import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     String,
  content:     String,
  coverImage:  String,
  author:      { type: String, default: 'QuadriBuilders' },
  tags:        [String],
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

blogPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model('BlogPost', blogPostSchema);

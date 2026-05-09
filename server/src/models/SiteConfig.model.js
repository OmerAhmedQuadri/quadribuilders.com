import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema({
  companyName:  { type: String, default: 'QuadriBuilders' },
  tagline:      String,
  description:  String,
  phone:        [String],
  email:        [String],
  address:      String,
  mapEmbedUrl:  String,
  social: {
    instagram: String,
    linkedin:  String,
    facebook:  String,
    twitter:   String,
    youtube:   String,
  },
  hero: {
    headline:        String,
    subheadline:     String,
    ctaText:         String,
    ctaLink:         String,
    backgroundImage: String,
  },
  stats: [{ label: String, value: String }],
  seo: {
    metaTitle:       String,
    metaDescription: String,
    ogImage:         String,
  },
}, { timestamps: true });

export default mongoose.model('SiteConfig', siteConfigSchema);

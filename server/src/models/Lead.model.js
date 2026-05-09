import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['callback', 'enquiry', 'listed-property', 'unlisted-property', 'contract'],
    required: true,
  },
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  email:   String,
  message: String,
  preferredTime:       String,
  projectId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  propertyDescription: String,
  budget:              String,
  location:            String,
  companyName:         String,
  projectScope:        String,
  timeline:            String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'closed'],
    default: 'new',
  },
  notes:     String,
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);

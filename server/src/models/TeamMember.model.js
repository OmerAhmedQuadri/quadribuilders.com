import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  role:     String,
  bio:      String,
  photo:    String,
  order:    { type: Number, default: 0 },
  linkedin: String,
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);

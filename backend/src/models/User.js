import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, required: true, select: false },
    location:    { type: String },
    photoUrl:    { type: String },
    skillsOffered: [{ type: String, trim: true }],
    skillsWanted:  [{ type: String, trim: true }],
    availability:  { type: String, default: 'Weekends' },
    isPublic:      { type: Boolean, default: true },
    role:          { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

export default model('User', userSchema);

// src/models/User.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    /* ---------- core auth ---------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // never return hash by default
    },

    /* ---------- public profile fields ---------- */
    isPublic: {
      type: Boolean,
      default: true,          // ✅ always public at sign‑up
    },

    skillsOffered: {
      type: [String],
      default: [],            // ✅ empty array instead of undefined
      trim: true,
    },

    skillsWanted: {
      type: [String],
      default: [],
      trim: true,
    },

    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'evenings', ''],
      default: '',            // ✅ optional, prevents “undefined”
    },

    rating: {
      type: Number,
      default: 0,
    },

    photoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default model('User', userSchema);

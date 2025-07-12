// src/models/User.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
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

    // hashed password (never return it in API):
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

export default model('User', userSchema);

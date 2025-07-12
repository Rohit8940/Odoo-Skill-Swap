import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const swapRequestSchema = new Schema(
  {
    fromUser:       { type: Types.ObjectId, ref: 'User', required: true },
    toUser:         { type: Types.ObjectId, ref: 'User', required: true },
    offeredSkill:   { type: String, required: true },
    requestedSkill: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default model('Swap', swapRequestSchema);


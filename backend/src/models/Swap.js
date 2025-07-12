import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const swapSchema = new Schema(
  {
    fromUser:      { type: Types.ObjectId, ref: 'User', required: true },
    toUser:        { type: Types.ObjectId, ref: 'User', required: true },

    offeredSkill:  { type: String, required: true },
    requestedSkill:{ type: String, required: true },

    message:       { type: String, maxlength: 500 },
    status:        {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default model('Swap', swapSchema);

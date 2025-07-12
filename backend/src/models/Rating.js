dnkasjdhas
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const ratingSchema = new Schema(
  {
    swap:   { type: Types.ObjectId, ref: 'SwapRequest', required: true },
    rater:  { type: Types.ObjectId, ref: 'User', required: true },
    ratee:  { type: Types.ObjectId, ref: 'User', required: true },
    score:  { type: Number, min: 1, max: 5, required: true },
    comment:{ type: String }
  },
  { timestamps: true }
);

export default model('Rating', ratingSchema);

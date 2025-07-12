import Swap from '../models/SwapRequest.js';

export const createSwap = async (req, res, next) => {
  try {
    const swap = await Swap.create({ ...req.body, fromUser: req.user._id });
    res.status(201).json(swap);
  } catch (err) {
    next(err);
  }
};

export const getMySwaps = async (req, res, next) => {
  try {
    const swaps = await Swap.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    }).populate('fromUser toUser', 'name skillsOffered skillsWanted');
    res.json(swaps);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // accepted | rejected | cancelled
    const swap = await Swap.findByIdAndUpdate(id, { status }, { new: true });
    res.json(swap);
  } catch (err) {
    next(err);
  }
};

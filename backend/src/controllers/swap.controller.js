import Swap from '../models/Swap.js';
import User from '../models/User.js';

/**
 * POST /api/swaps
 * body: { toUser, offeredSkill, requestedSkill, message }
 */
export const createSwap = async (req, res) => {
  try {
    const { toUser, offeredSkill, requestedSkill, message = '' } = req.body;

    if (!toUser || !offeredSkill || !requestedSkill) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (toUser === req.user.id) {
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(req.user.id),
      User.findById(toUser),
    ]);
    if (!receiver || !receiver.isPublic) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Validate skills
    if (!sender.skillsOffered.includes(offeredSkill)) {
      return res
        .status(400)
        .json({ message: 'You do not offer that skill' });
    }
    if (!receiver.skillsWanted.includes(requestedSkill)) {
      return res
        .status(400)
        .json({ message: 'Target user does not want that skill' });
    }

    const swap = await Swap.create({
      fromUser: req.user.id,
      toUser,
      offeredSkill,
      requestedSkill,
      message,
    });

    res.status(201).json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create swap' });
  }
};

/**
 * GET /api/swaps/my
 * returns swaps where user is sender OR receiver
 */
export const mySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ fromUser: req.user.id }, { toUser: req.user.id }],
    })
      .populate('fromUser', 'name photoUrl rating')
      .populate('toUser', 'name photoUrl rating')
      .sort('-createdAt');

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch swaps' });
  }
};

/**
 * PATCH /api/swaps/:id/status  { status: accepted|rejected }
 * Only the receiver (toUser) may update status
 */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update swap' });
  }
};

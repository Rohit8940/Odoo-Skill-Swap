// controllers/user.controller.js
import mongoose from 'mongoose';
import User from '../models/User.js';

/* ------------ 1. Public user list ------------ */
export const getPublicUsers = async (req, res) => {
  try {
    const { skill = '', availability = '', page = 1, limit = 5 } = req.query;

    const query = {
      isPublic: true,
      ...(availability && { availability }),
      ...(skill && {
        $or: [
          { skillsOffered: { $regex: skill, $options: 'i' } },
          { skillsWanted: { $regex: skill, $options: 'i' } },
        ],
      }),
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const safeLimit = Math.min(parseInt(limit), 20);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('_id name email photoUrl skillsOffered skillsWanted availability rating')
        .skip(skip)
        .limit(safeLimit),
      User.countDocuments(query),
    ]);

    res.json({ users, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/* ------------ 2. Public or Self Profile ------------ */
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // a) self
    if (!id || id === 'me') {
      const me = await User.findById(req.user?.id).select('-password');
      return res.json(me);
    }

    // b) check ID validity
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // c) public profile
    const user = await User.findById(id).select(
      'name email photoUrl skillsOffered skillsWanted availability rating isPublic'
    );

    if (!user || !user.isPublic) {
      return res.status(404).json({ message: 'User not found or private' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

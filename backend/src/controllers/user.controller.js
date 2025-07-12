import User from '../models/User.js';

export const getMe = (req, res) => res.json(req.user);

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

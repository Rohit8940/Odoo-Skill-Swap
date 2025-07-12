// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, _, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new Error('No token'));

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    next();
  } catch {
    next(new Error('Token invalid'));
  }
};

// src/middleware/errorHandler.js
export const errorHandler = (err, req, res, _next) =>
  res.status(400).json({ message: err.message });

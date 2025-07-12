// backend/src/middleware/errorHandler.js

export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Server error' });
};

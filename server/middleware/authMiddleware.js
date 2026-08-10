import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Token usually comes as: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer xyz" -> "xyz"

    // Verify signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (minus password) to the request for downstream handlers
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next(); // token valid — let the request continue to the actual route
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
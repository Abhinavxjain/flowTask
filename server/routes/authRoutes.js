import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example protected route — only accessible with a valid token
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
import express from 'express';
import { createComment, getCommentsForTask, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createComment);
router.get('/:taskId', getCommentsForTask);
router.delete('/:id', deleteComment);

export default router;
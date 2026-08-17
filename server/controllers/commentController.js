import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const isProjectMember = (project, userId) => {
  return (
    project.owner.toString() === userId.toString() ||
    project.members.some((m) => m.toString() === userId.toString())
  );
};

// POST /api/comments
export const createComment = async (req, res) => {
  try {
    const { text, taskId } = req.body;

    if (!text || !taskId) {
      return res.status(400).json({ message: 'Text and taskId are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    const comment = await Comment.create({
      text,
      task: taskId,
      author: req.user._id,
    });

    // Populate the author so the frontend has the name immediately, no refetch needed
    await comment.populate('author', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/comments/:taskId
export const getCommentsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 }); // oldest first, like a chat thread

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the comment's author can delete their own comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
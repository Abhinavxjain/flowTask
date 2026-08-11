import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Helper: check if user is owner or member of the task's project
const isProjectMember = (project, userId) => {
  return (
    project.owner.toString() === userId.toString() ||
    project.members.some((m) => m.toString() === userId.toString())
  );
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Nested authorization — user must belong to the parent project
    if (!isProjectMember(projectDoc, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tasks?project=<projectId>
export const getTasks = async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ message: 'Project query param is required' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isProjectMember(projectDoc, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }

    const tasks = await Task.find({ project }).populate('assignedTo', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectDoc = await Project.findById(task.project);
    if (!isProjectMember(projectDoc, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectDoc = await Project.findById(task.project);
    if (!isProjectMember(projectDoc, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectDoc = await Project.findById(task.project);
    if (!isProjectMember(projectDoc, req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
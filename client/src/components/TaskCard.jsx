// GET /api/tasks?project=<id>&status=&priority=&search=&page=&limit=
export const getTasks = async (req, res) => {
  try {
    const { project, status, priority, search, page = 1, limit = 10 } = req.query;

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

    // Build the filter object dynamically based on what was provided
    const filter = { project };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalCount] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
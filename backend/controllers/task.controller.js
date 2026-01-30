import Task from "../models/Task.js";

/**
 * POST /tasks
 * body: { title, projectId }
 */
export const addTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "title and projectId required" });
    }

    const task = await Task.create({
      title,
      projectId,
      completed: false,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Add task failed" });
  }
};

/**
 * GET /tasks/:projectId
 */
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch tasks failed" });
  }
};

/**
 * PATCH /tasks/:taskId
 * toggle completed
 */
export const toggleTaskCompleted = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update task failed" });
  }
};

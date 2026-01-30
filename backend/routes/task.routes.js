import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addTask,
  getTasksByProject,
  toggleTaskCompleted,
} from "../controllers/task.controller.js";
import Task from "../models/Task.js";  // Import for delete

const router = express.Router();

router.post("/", authMiddleware, addTask);
router.get("/:projectId", authMiddleware, getTasksByProject);
router.patch("/:taskId", authMiddleware, toggleTaskCompleted);

/* DELETE TASK */
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Optional: Check if task belongs to user's project (add if needed)
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete task failed" });
  }
});

export default router;
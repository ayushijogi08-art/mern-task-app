import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/* CREATE PROJECT */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      userId: req.userId,
      name: req.body.name || "New Project"  // Default name if not provided
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Create project failed" });
  }
});

/* GET ALL MY PROJECTS */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* UPDATE PROJECT NAME */
router.patch("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const project = await Project.findOne({ _id: projectId, userId: req.userId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Update project failed" });
  }
});

export default router;
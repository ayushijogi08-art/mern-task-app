// src/pages/Projects.js
import { useEffect, useState } from "react";
import api from "../api";
import "./Projects.css";
import { useNavigate } from "react-router-dom";  // Add for logout navigation

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add for better error handling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/me");
        setProjects(res.data);
        if (res.data.length > 0) {
          handleSelectProject(res.data[0]);
        } else {
          // Auto-create a default project if none
          try {
            const createRes = await api.post("/projects", { name: "My First Project" });
            setProjects([createRes.data]);
            handleSelectProject(createRes.data);
          } catch (createErr) {
            console.error("Auto-create project failed:", createErr);
            setError("Failed to create default project. Please try creating one manually.");
          }
        }
      } catch (err) {
        console.error("Fetch projects failed:", err);
        if (err?.response?.status === 401) {
          navigate("/login");  // Use navigate instead of window.location
        } else {
          setError("An error occurred while fetching projects. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    try {
      const tasksRes = await api.get(`/tasks/${project._id}`);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      setError("Failed to fetch tasks for this project.");
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await api.post("/projects", { name: newProjectName });
      setProjects([...projects, res.data]);
      setNewProjectName("");
      handleSelectProject(res.data);  // Select the new one
    } catch (err) {
      console.error("Create project failed:", err);
      setError("Failed to create project.");
    }
  };

  const updateProjectName = async () => {
    if (!newName.trim() || !selectedProject) return;
    try {
      const res = await api.patch(`/projects/${selectedProject._id}`, { name: newName });
      setProjects(projects.map(p => p._id === selectedProject._id ? res.data : p));
      setSelectedProject(res.data);
      setNewName("");
      setEditingProjectName(false);
    } catch (err) {
      console.error("Update project failed:", err);
      setError("Failed to update project name.");
    }
  };

  const addTask = async () => {
    if (!title.trim() || !selectedProject) return;
    try {
      await api.post("/tasks", {
        title,
        projectId: selectedProject._id,
      });
      setTitle("");
      const res = await api.get(`/tasks/${selectedProject._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Add task failed:", err);
      setError("Failed to add task.");
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}`);
      const res = await api.get(`/tasks/${selectedProject._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Toggle task failed:", err);
      setError("Failed to toggle task.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      const res = await api.get(`/tasks/${selectedProject._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Delete task failed:", err);
      setError("Failed to delete task.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;  // Display errors visibly

  return (
    <div className="container">
      <button onClick={handleLogout} style={{ float: "right", marginBottom: "10px" }}>Logout</button>
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((proj) => (
          <button
            key={proj._id}
            onClick={() => handleSelectProject(proj)}
            className={selectedProject?._id === proj._id ? "selected" : ""}
          >
            {proj.name}
          </button>
        ))}
      </div>

      <div className="create-project">
        <input
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button onClick={createProject} disabled={!newProjectName.trim()}>Create Project</button>
      </div>

      {selectedProject ? (
        <>
          <h3>{selectedProject.name}</h3>
          <button onClick={() => setEditingProjectName(!editingProjectName)}>
            {editingProjectName ? "Cancel" : "Edit Name"}
          </button>
          {editingProjectName && (
            <div className="edit-project">
              <input
                placeholder="New Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={updateProjectName} disabled={!newName.trim()}>Save</button>
            </div>
          )}

          <div className="add-task">
            <input
              placeholder="New task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={addTask} disabled={!title.trim()}>Add</button>
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                />
                <span>{task.title}</span>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No projects yet. Create one to start adding tasks!</p>
      )}
    </div>
  );
}

export default Projects;
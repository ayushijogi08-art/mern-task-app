// src/App.js (Updated to add route for /register)
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";  // Add import
import Projects from "./pages/Projects";

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Add this route */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/" element={<Projects />} /> {/* Default to projects if logged in */}
      </Routes>
    </Router>
  );
}

export default App;
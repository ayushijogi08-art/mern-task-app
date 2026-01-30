// src/pages/Login.js (Updated to add link to Register)
import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");  // Clear token on login page load (to force logout/login)
  }, []);

  async function handleLogin() {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/projects");  // Redirect to projects page
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#fff'  // Optional: Ensure white background
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <input 
          placeholder="Email" 
          onChange={e => setEmail(e.target.value)} 
          style={{ padding: '8px', width: '200px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '8px', width: '200px' }} 
        />
        <button 
          onClick={handleLogin} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Login
        </button>
        <p>New user? <a href="/register" style={{ color: 'blue', cursor: 'pointer' }}>Register</a></p>
      </div>
    </div>
  );
}
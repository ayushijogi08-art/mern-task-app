// src/pages/Register.js (New file)
import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      await api.post("/auth/register", { email, password });
      alert("Registration successful! Please login.");
      navigate("/login");  // Redirect to login after registration
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || "Unknown error"));
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
          onClick={handleRegister} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Register
        </button>
        <p>Already have an account? <a href="/login" style={{ color: 'blue', cursor: 'pointer' }}>Login</a></p>
      </div>
    </div>
  );
}
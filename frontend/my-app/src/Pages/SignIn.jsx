"use client";
import React from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "../styles/SignIn.css";
import EmailIcon from "../components/Sign In Components/EmailIcon";
import LockIcon from "../components/Sign In Components/LockIcon";

function SignIn() {
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    navigate("/chat"); 
  };

  return (
    <div className="signin-container">
      <img src="/logo.png" alt="AI Study Assistant" className="signin-logo" />

      <h1 className="signin-title">Welcome Back!</h1>

      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <EmailIcon className="input-icon" />
          <input type="email" placeholder="Email" required />
        </div>

        <div className="input-group">
          <LockIcon className="input-icon" />
          <input type="password" placeholder="Password" required />
        </div>

        <button type="submit" className="signin-button">Sign In</button>
      </form>

      <p className="signup-prompt">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;

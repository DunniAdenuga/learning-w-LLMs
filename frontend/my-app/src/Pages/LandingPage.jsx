import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  // Simulate auth status (replace with real logic later)
  const isAuthenticated = false;

  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Logo Section */}
      <div className="logo-section">
        <img src="/logo.png" alt="AI Study Assistant" className="logo-img" />
      </div>

      {/* Hero Section */}
      <h2 className="subtitle">Welcome to</h2>
      <h1 className="title">AI Study Assistant</h1>

      {/* Start Section */}
      <div className="start-section">
        <button className="start-btn" onClick={handleStartLearning}>
          Start Learning
        </button>
        <div className="topic-tag">Time Complexity | Logic</div>
      </div>
    </div>
  );
}

export default LandingPage;







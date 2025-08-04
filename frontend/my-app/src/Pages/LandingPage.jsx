import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import MainLayout from '../layouts/MainLayout';

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

  const handleStartExplanation = () => {
    if (isAuthenticated) {
      navigate("/explanation"); /* explanation page hasn't been designed */
    } else {
      navigate("/signin");
    }
  }

  const handleStartRevision = () => {
    if (isAuthenticated) {
      navigate("/Revision"); /* Revision page hasn't been designed */
    } else {
      navigate("/signin");
    }
  }

  return (
    <MainLayout>
      <div className={`landing-container`}>
        {/* Navigation */}
        <nav className="navbar">
          <Link to="/about">About Us</Link>
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
            Studying
          </button>
          <button className='start-btn' onClick={handleStartExplanation}>
            Explanation
          </button>
          <button className='start-btn' onClick={handleStartRevision}>
            Revision
          </button>
        </div>

        <div className="topic-tag">Time Complexity | Logic</div>
      </div>
    </MainLayout>

  );
}

export default LandingPage;







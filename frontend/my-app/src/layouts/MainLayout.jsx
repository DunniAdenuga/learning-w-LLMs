import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation/Navigation';
import './MainLayout.css'; 

function MainLayout({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsNavOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="main-layout">
      <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} />

      <main
        className="main-content"
        style={{
          marginLeft: isNavOpen ? '200px' : '0',
          alignItems: isNavOpen ? 'flex-start' : 'center',
          width: isNavOpen ? 'calc(100% - 200px)' : '100%',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
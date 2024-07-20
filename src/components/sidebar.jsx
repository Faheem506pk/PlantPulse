import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  // Scroll to the top when the location pathname changes
  useEffect(() => {
    console.log('Navigating to:', location.pathname); // Debugging line
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="usersidebar">
      <aside className="side-navbar">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className={isActive('/dashboard')} aria-current="page">
              <span className="nav-icon">
                <i className="bi bi-cloud-sun-fill"></i>
              </span>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/graphs" className={isActive('/graphs')}>
              <span className="nav-icon">
                <i className="bi bi-map-fill"></i>
              </span>
              Graphs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/presets" className={isActive('/presets')}>
              <span className="nav-icon">
                <i className="bi bi-list-task"></i>
              </span>
              Presets
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className={isActive('/profile')}>
              <span className="nav-icon">
                <i className="bi bi-gear-fill"></i>
              </span>
              Settings
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const itemHeight = 120; // Adjust this value based on the height of your nav items including padding and margins

    const sidebarHeight = navItems.length * itemHeight;
    sidebar.style.maxHeight = `${sidebarHeight}px`;
  }, []);

  return (
    <div className="sidebar">
      <aside className="side-navbar">
        <ul className="nav ">
          <li className="nav-item">
            <Link to="/" className="nav-link active" aria-current="page">
              <span className="nav-icon">
                <i className="bi bi-cloud-sun-fill"></i>
              </span>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/graphs">
              <span className="nav-icon">
                <i className="bi bi-map-fill"></i>
              </span>
              Graphs
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span className="nav-icon">
                <i className="bi bi-list-task"></i>
              </span>
              Presets
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span className="nav-icon">
                <i className="bi bi-gear-fill"></i>
              </span>
              Settings
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}

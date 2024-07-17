import React from 'react';
import { Link } from 'react-router-dom'; // Add this import

export default function Sidebar() {
  return (
    <div className="sidebar">
      <aside className="side-navbar">
        <ul className="nav flex-column">
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

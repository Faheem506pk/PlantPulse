import React from 'react';

export default function Sidebar() {
  return (
    <div className="sidebar">
    <aside className="side-navbar">
      <div className="d-flex align-items-center justify-content-center h-100">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              <span className="nav-icon">
                <i className="bi bi-cloud-sun-fill"></i>
              </span>
              Weather
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span className="nav-icon">
                <i className="bi bi-list-task"></i>
              </span>
              Cities
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span className="nav-icon">
                <i className="bi bi-map-fill"></i>
              </span>
              Map
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
      </div>
    </aside>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import "../assets/css/admin.css"; // Adjust the path as needed
import { auth } from "../hooks/useFirebaseData"; // Ensure correct path
import { toast } from 'react-toastify'; // Import toast for notifications

const AppSidebar = ({ userDetails }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [show, setShow] = useState(false); // Define show state

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login"); // Use navigate for redirection
      toast.success("User logged out successfully!");
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  }

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
    <div className="adminsidebar">
      <aside className="side-navbar">
      
      {/* Top Navbar */}
      <div className="admin-Topbar">
        <div className="admin-today-weather">
          <h1>Plant Pulse</h1>
        </div>
       <div className="admin-btn-container">
        <button type="button" className="btn btn-primary admin-btn" onClick={handleShow}>
          <i className="bi bi-list"></i>
        </button>
        </div>
      </div>

      {/* Sidebar for larger screens */}
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark d-none d-md-block">
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <i className="bi bi-bootstrap" style={{ fontSize: 40 }}></i>
          <span className="fs-4 ms-2">Plant Pulse</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/" className={isActive('/')}>
              <i className="bi bi-house-door me-2" style={{ fontSize: 16 }}></i>
              <span className="d-inline">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              <i className="bi bi-speedometer2 me-2" style={{ fontSize: 16 }}></i>
              <span className="d-inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/orders" className={isActive('/orders')}>
              <i className="bi bi-table me-2" style={{ fontSize: 16 }}></i>
              <span className="d-inline">Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products')}>
              <i className="bi bi-grid me-2" style={{ fontSize: 16 }}></i>
              <span className="d-inline">Products</span>
            </Link>
          </li>
          <li>
          <a className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sign out
                </a>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
            <strong>mdo</strong>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-plus-circle me-2"></i> New project...
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gear me-2"></i> Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-person me-2"></i> Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Offcanvas for mobile */}
      <Offcanvas show={show} onHide={handleClose} responsive="md" className="bg-dark text-white d-md-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sidebar</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link to="/" className={isActive('/')}>
                <i className="bi bi-house-door me-2"></i>
                <span className="d-inline">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={isActive('/dashboard')}>
                <i className="bi bi-speedometer2 me-2"></i>
                <span className="d-inline">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className={isActive('/orders')}>
                <i className="bi bi-table me-2"></i>
                <span className="d-inline">Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className={isActive('/products')}>
                <i className="bi bi-grid me-2"></i>
                <span className="d-inline">Products</span>
              </Link>
            </li>
            <li>
            <a className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sign out
                </a>
            </li>
          </ul>
          <hr />
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt=""
                width={32}
                height={32}
                className="rounded-circle me-2"
              />
              <strong>mdo</strong>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-plus-circle me-2"></i> New project...
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-gear me-2"></i> Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-person me-2"></i> Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sign out
                </a>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      </aside>
    </div>
  );
};

export default AppSidebar;

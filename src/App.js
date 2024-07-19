import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashbord';
import Graphs from './components/Graphs';
import Presets from './components/Presets';
import Settings from './components/Settings';
import Sidebar from './components/sidebar';
import Topbar from './components/Topbar';
import Profile from './components/Profile';
import Register from './components/register';
import Login from './components/login';
import EditProfile from './components/EditProfile';
import { auth } from "./hooks/useFirebaseData"; // Import auth from your Firebase configuration

const App = () => {
  const [user, setUser] = useState(null); // Initial state is null to indicate no user is authenticated
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <div className="app">
      {!isAuthRoute && <Topbar />}
      <div className="main-layout">
        {!isAuthRoute && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/edit-profile" element={user ? <EditProfile/> : <Navigate to="/login" />} />
            <Route path="/graphs" element={user ? <Graphs /> : <Navigate to="/login" />} />
            <Route path="/presets" element={user ? <Presets /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

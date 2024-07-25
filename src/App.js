import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashbord';
import Graphs from './components/Graphs';
import Presets from './components/Presets';
import Settings from './components/Settings';
import Sidebar from './components/sidebar';
import Topbar from './components/Topbar';
import Profile from './components/Profile';
import Register from './components/register';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/login';
import EditProfile from './components/EditProfile';
import ScrollToTop from './components/ScrollToTop';
import { auth } from "./hooks/useFirebaseData";
import { UserProvider } from './components/UserContext';
import DefaultLayout from './admin/DefaultLayout';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const adminEmail = "admin@gmail.com";

  // Determine if the current route is for admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
      if (user) {
        setIsAdmin(user.email === adminEmail);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserProvider>
      <div className="App">
        {/* Admin Routes */}
        {isAdminRoute ? (
          <Routes>
            <Route path="/admin/*" element={isAdmin ? <Login /> : <DefaultLayout /> } />
          </Routes>
        ) : (
          <div className="main-layout">
            {/* Conditionally render Topbar and Sidebar based on route */}
            {!isAuthRoute && <Topbar />}
            {!isAuthRoute && <Sidebar />}
            <div className="main-content">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/graphs" element={user ? <Graphs /> : <Navigate to="/login" />} />
                <Route path="/presets" element={user ? <Presets /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/forgotpassword" element={!user ? <ForgotPassword /> : <Navigate to="/login" />} />
                <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
              </Routes>
              <ToastContainer />
            </div>
          </div>
        )}
      </div>
    </UserProvider>
  );
};

export default App;

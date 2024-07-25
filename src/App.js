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
import { auth, db } from "./hooks/useFirebaseData";
import { UserProvider } from './components/UserContext';
import DefaultLayout from './admin/DefaultLayout';
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
        } else {
          setIsAdmin(false);
        }
        setUser(user);
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
      <div className="App">
        {isAdminRoute ? (
          <Routes>
            <Route path="/admin/*" element={isAdmin ? <DefaultLayout /> : <Navigate to="/login" />} />
          </Routes>
        ) : (
          <div className="main-layout">
            {!isAuthRoute && <Topbar />}
            {!isAuthRoute && <Sidebar />}
            <div className="main-content">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={user ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={user && !isAdmin ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/graphs" element={user && !isAdmin ? <Graphs /> : <Navigate to="/login" />} />
                <Route path="/presets" element={user && !isAdmin ? <Presets /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user && !isAdmin ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user && !isAdmin ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
                <Route path="/forgotpassword" element={!user ? <ForgotPassword /> : <Navigate to="/login" />} />
                <Route path="/edit-profile" element={user && !isAdmin ? <EditProfile /> : <Navigate to="/login" />} />
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

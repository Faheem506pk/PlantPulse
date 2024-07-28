import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';

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
import AddNewPresets from './admin/AddNewPresets';
import AddNewUser from './admin/AddNewUser';
import AdminGraphs from './admin/AdminGraphs';
import AdminProfile from './admin/AdminProfile';
import SearchUsers from './admin/SearchUsers';
import UserPasswordReset from './admin/UserPasswordReset';
import ViewAllUsers from './admin/ViewAllUsers';
import AppContent from './admin/AppContent';
import EditAdminProfile from './admin/EditAdminProfile';
import Presets from './admin/Presets';
import UserGraphs from './components/UserGraphs';
import UserPresets from './components/UserPresets';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      console.log("Current Scroll Top:", currentScrollTop, "Last Scroll Top:", lastScrollTop);
    
      if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        setIsTopbarVisible(false);
      } else {
        setIsTopbarVisible(true);
      }
      
      setLastScrollTop(currentScrollTop);
    };
    

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
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

  const adminRoutes = (
    <Routes>
      <Route path="/admin" element={isAdmin ? <AppContent /> : <Navigate to="/login" />} />
      <Route path="/admin/addnewpreset" element={isAdmin ? <AddNewPresets /> : <Navigate to="/login" />} />
      <Route path="/admin/graphs" element={isAdmin ? <AdminGraphs /> : <Navigate to="/login" />} />
      <Route path="/admin/addnewuser" element={isAdmin ? <AddNewUser /> : <Navigate to="/login" />} />
      <Route path="/admin/profile" element={isAdmin ? <AdminProfile /> : <Navigate to="/login" />} />
      <Route path="/admin/editprofile" element={isAdmin ? <EditAdminProfile /> : <Navigate to="/login" />} />
      <Route path="/admin/presets" element={isAdmin ? <Presets /> : <Navigate to="/login" />} />
      <Route path="/admin/searchusers" element={isAdmin ? <SearchUsers /> : <Navigate to="/login" />} />
      <Route path="/admin/resetuserpassword" element={isAdmin ? <UserPasswordReset /> : <Navigate to="/login" />} />
      <Route path="/admin/viewallusers" element={isAdmin ? <ViewAllUsers /> : <Navigate to="/login" />} />
      <Route path="/admin/*" element={<Navigate to="/admin" />} />
    </Routes>
  );

  const userRoutes = (
    <Routes>
      <Route path="/" element={user ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user && !isAdmin ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/graphs" element={user && !isAdmin ? <UserGraphs /> : <Navigate to="/login" />} />
      <Route path="/presets" element={user && !isAdmin ? <UserPresets /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user && !isAdmin ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user && !isAdmin ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/forgotpassword" element={!user ? <ForgotPassword /> : <Navigate to="/login" />} />
      <Route path="/edit-profile" element={user && !isAdmin ? <EditProfile /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return (
    <UserProvider>
      <div className="App">
        {isAdminRoute ? (
          <DefaultLayout routes={adminRoutes} />
        ) : (
          <div className="main-layout">
            {!isAuthRoute && <Topbar className={visible ? 'top-show' : 'top-hide'} />}
            {!isAuthRoute && <Sidebar />}
            <div className="main-content">
              <ScrollToTop />
              {userRoutes}
              
            </div>
          </div>
        )}
      </div>
    </UserProvider>
  );
};

export default App;

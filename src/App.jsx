import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Leaf } from 'lucide-react';
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
import { UserContext, UserProvider } from './components/UserContext';
import DefaultLayout from './admin/DefaultLayout';
import { doc, getDoc } from 'firebase/firestore';
import AddNewPresets from './admin/AddNewPresets';
import AddNewUser from './admin/AddNewUser';
import AdminGraphs from './admin/AdminGraphs';
import AdminProfile from './admin/AdminProfile';
import SearchUsers from './admin/SearchUsers';
import UserPasswordReset from './admin/UserPasswordReset';
import ViewAllUsers from './admin/ViewAllUsers';
import AdminDashboard from './admin/AppContent'; // Renamed import
import EditAdminProfile from './admin/EditAdminProfile';
import Presets from './admin/Presets';

import UserGraphs from './components/UserGraphs';
import UserPresets from './components/UserPresets';

const MainAppLayout = () => {
  const { user, isAdmin, loading } = useContext(UserContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgotpassword'].includes(location.pathname);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-brand-deep flex flex-col items-center justify-center gap-4">
        <div className="bg-brand-neon p-4 rounded-2xl glow-green animate-pulse">
          <Leaf className="w-10 h-10 text-brand-deep" />
        </div>
        <div className="w-48 h-1 bg-brand-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand-neon animate-progress" style={{ width: '40%' }} />
        </div>
        <p className="text-[10px] font-black text-brand-neon uppercase tracking-[0.3em] animate-pulse">Initializing System...</p>
      </div>
    );
  }

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

  const adminRoutes = (
    <Routes>
      <Route path="/admin" element={isAdmin ? <DefaultLayout routes={<Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/addnewpreset" element={<AddNewPresets />} />
        <Route path="/graphs" element={<AdminGraphs />} />
        <Route path="/addnewuser" element={<AddNewUser />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/editprofile" element={<EditAdminProfile />} />
        <Route path="/presets" element={<Presets />} />
        <Route path="/searchusers" element={<SearchUsers />} />
        <Route path="/resetuserpassword" element={<UserPasswordReset />} />
        <Route path="/viewallusers" element={<ViewAllUsers />} />
      </Routes>} /> : <Navigate to="/login" />} />
    </Routes>
  );

  return (
    <div className="min-h-screen w-full bg-brand-deep font-sans antialiased text-white selection:bg-brand-neon/30">
      {isAdminRoute ? (
        adminRoutes
      ) : isAuthRoute ? (
        <div className="w-full min-h-screen bg-brand-deep overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 py-12">
            {userRoutes}
          </div>
        </div>
      ) : (
        <div className="flex w-full min-h-screen bg-brand-deep relative overflow-hidden">
          <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-all duration-300"
              onClick={toggleSidebar}
            />
          )}

          <div className="flex flex-col flex-1 w-full min-h-screen transition-all duration-300 lg:pl-64 overflow-hidden">
            <Topbar toggleSidebar={toggleSidebar} />
            <main
              className="flex-1 p-4 lg:p-8 w-full overflow-y-auto"
            >
              <ScrollToTop />
              <div className="max-w-7xl mx-auto w-full pb-20">
                {userRoutes}
              </div>
            </main>
          </div>
        </div>
      )}
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <MainAppLayout />
    </UserProvider>
  );
};

export default App;

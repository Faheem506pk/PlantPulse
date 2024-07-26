import React, { useState, useEffect, useContext } from 'react';
import { auth } from "../hooks/useFirebaseData";
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext";

const Topbar = () => {
  const { userDetails, loading } = useContext(UserContext);
  const [showTopbar, setShowTopbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setShowTopbar(false);
      } else {
        setShowTopbar(true);
      }
      setLastScrollTop(scrollTop);
    };

    const debounce = (func, wait) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(), wait);
      };
    };

    const debouncedHandleScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedHandleScroll);

    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    if (userDetails) {
      // Force re-render to update profile picture
    }
  }, [userDetails]);

  if (loading) {
    return <p className="loader">Loading...</p>;
  }

  return (
    <div className={`Topbar `}>
      <div className="today-weather">
        <h1>Plant Pulse</h1>
      </div>
      <div className="dp-img-2">
        <Link to="/profile">
          <img
            src={userDetails?.photo || "./assets/images/default-photo.png"}
            className="dp-img"
            alt="User Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import '../assets/css/style.css';

const Topbar = () => {
  const { userDetails, loading } = useContext(UserContext);
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        setIsTopbarVisible(false);
      } else {
        setIsTopbarVisible(true);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  if (loading) {
    return (
      <div className="l-loader-container">
        <div className="l-loader"></div>
      </div>
    );
  }

  return (
    <div className={`Topbar ${isTopbarVisible ? 'top-show' : 'top-hide'}`}>
      
      <div className="today-weather">
        <h1>Plant Pulse</h1>
      </div>
      <div className="dp-img-2">
        <Link to="/profile">
          <img
            src={userDetails?.photo || './assets/images/default-photo.png'}
            className="dp-img"
            alt="User Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;

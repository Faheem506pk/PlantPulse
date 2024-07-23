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
      setShowTopbar(scrollTop < lastScrollTop || scrollTop < 100); // Show Topbar if scrolling up or at the top
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`Topbar ${showTopbar ? 'show' : 'hide'}`}>
      <div className="today-weather">
        <h1>Plant Pulse</h1>
      </div>
      <div className="dp-img-2">  
        <Link to="/profile" >
          <img
            src={userDetails?.photo || "./assets/images/default-photo.png"} // Provide a default image URL if photo is not available
            className="dp-img"
            alt="User Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;

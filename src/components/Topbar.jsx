import React, { useState, useEffect } from 'react';
import { auth, db, useFirebaseData } from "../hooks/useFirebaseData";
import { doc, getDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { temperature } = useFirebaseData();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Authenticated user:", user);

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            console.log("User data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`Topbar ${showTopbar ? 'show' : 'hide'}`}>
      <div className="today-weather">
        <h1>Plant Pulse</h1>
      </div>
      <div className="dp-img-2">  
      <Link to="/profile" className="nav-link" >
        <img
          src={userDetails?.photo || "default-photo-url"} // Provide a default image URL if photo is not available
          className="dp-img"
          alt="User Profile"
        />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;

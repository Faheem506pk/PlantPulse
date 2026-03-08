import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { auth, db } from "../hooks/useFirebaseData";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
function Settings() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="l-loader-container">
        <div className="l-loader"></div>
      </div>
    );
  }

  return (
    <main className="main-wrapper">
      <ToastContainer />
    <div className="container profile-container">
      <div className="row gutters-sm">
        <div className="col-md-4 profile-n">
          <div className="card profile-card ">
            <div className="card-body text-center d-flex justify-content-center flex-column justify-content-center align-items-center ">
              <img
                src={userDetails?.photo || './assets/images/default-photo.png'}
                alt="User Profile"
                className="rounded-circle profile-img"
              />
              <h4>{userDetails?.firstName || "John"} {userDetails?.lastName || "Doe"}</h4>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card profile-card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{userDetails?.firstName || "Kenneth"}</span>
                  <span className="last-name">{userDetails?.lastName || "Valdez"}</span>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userDetails?.email || "fip@jukmuh.al"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Phone</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userDetails?.phone || "(239) 816-9029"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">City</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userDetails?.mobile || "Chakwal"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Address</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {userDetails?.address || "Bay Area, San Francisco, CA"}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12">
                <Link to="/edit-profile" className="btn btn-info">
      Edit Profile
    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}

export default Settings;

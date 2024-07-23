import React, { useEffect, useState } from "react";
import { auth, db } from "../hooks/useFirebaseData";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "../assets/css/style.css"; // Make sure to create this file for custom styles

function Profile() {
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
            setUserDetails({
              photo: "./assets/images/default-photo.png",
              firstName: "First Name",
              lastName: "Last Name",
              email: "Email",
              phone: "Phone",
              city: "City",
              address: "Address",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserDetails({
            photo: "./assets/images/default-photo.png",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            phone: "Phone",
            city: "City",
            address: "Address",
          });
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
    <main className="main-wrapper">
      <div className="profile-cd">
        <div className="">
          <div className="profile-n">
            <div className="card profile-card glass-effect d-flex justify-content-center flex-column align-items-center">
              <div className="card-body profile-w d-flex align-items-center flex-column justify-content-center">
                <div className="text-center mb-4">
                  <img
                    src={userDetails?.photo || './assets/images/default-photo.png'}
                    alt="User Profile"
                    className="rounded-circle profile-img"
                  />
                  <h4>{userDetails?.firstName || "Full Name"} {userDetails?.lastName || ""}</h4>
                  <button className="btn btn-primary" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        
          <div className="profile-details">
            <div className="card profile-card glass-effect">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-sm-12">
                      <h6 className="mb-0">Full Name</h6>
                      <div className="text-secondary">
                        <span>{userDetails?.firstName || "Name"}</span>
                        <span className="last-name">{userDetails?.lastName || ""}</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12">
                      <h6 className="mb-0">Email</h6>
                      <div className="text-secondary">
                        {userDetails?.email || "Email"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12">
                      <h6 className="mb-0">Phone</h6>
                      <div className="text-secondary">
                        {userDetails?.phone || "Phone"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12">
                      <h6 className="mb-0">City</h6>
                      <div className="text-secondary">
                        {userDetails?.city || "City"}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12">
                      <h6 className="mb-0">Address</h6>
                      <div className="text-secondary">
                        {userDetails?.address || "Address"}
                      </div>
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;

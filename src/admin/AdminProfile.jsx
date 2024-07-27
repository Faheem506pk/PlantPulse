import React, { useEffect, useState } from "react";
import { auth, db } from "../hooks/useFirebaseData";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/admin.css"; // Make sure to create this file for custom styles

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAdminData(docSnap.data());
          } else {
            setAdminData({
              photo: "./assets/images/default-photo.png",
              name: "Name",
              email: "Email",
              phone: "Phone",
              address: "Address",
            });
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
          setAdminData({
            photo: "./assets/images/default-photo.png",
            name: "Name",
            email: "Email",
            phone: "Phone",
            address: "Address",
          });
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user logged in");
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="admin-profile-container">
      {adminData ? (
        <div className="admin-profile-content">
          <h2 className="text-center">Admin Profile</h2>
          <div className="profile-photo-container">
            <img src={adminData.photo} alt="Profile" className="profile-photo" />
          </div>
          <div className="admin-profile-details">
            <div className="form-group">
              <label className="form-label">Name</label>
              <p className="form-control">{adminData.firstName} {adminData.lastName}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <p className="form-control">{adminData.email}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <p className="form-control">{adminData.phone}</p>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <p className="form-control">{adminData.city}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <p className="form-control">{adminData.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="admin-no-data">No profile data available.</p>
      )}
      <ToastContainer />
    </div>
  );
}

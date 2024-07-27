import React, { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../hooks/useFirebaseData";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/admin.css"; // Adjust the path as needed

const EditAdminProfile = () => {
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    photo: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const cropperRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const user = auth.currentUser;
      if (user) {
        const adminDocRef = doc(db, 'users', user.uid);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          setAdminData(adminDoc.data());
        }
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setShowCropper(true);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL("image/jpeg");
      setCroppedImage(croppedImageUrl);
      setShowCropper(false);
      setShowUploadPopup(true);
    }
  };

  const updatePhoto = async () => {
    const user = auth.currentUser;
    if (user && croppedImage) {
      const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      try {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const photoURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "users", user.uid), { photo: photoURL });
        setAdminData({ ...adminData, photo: photoURL });
        setCroppedImage(null);
        setShowUploadPopup(false);
        toast.success("Profile photo updated successfully!");
      } catch (error) {
        console.error("Error updating profile photo:", error);
        toast.error("Error updating profile photo.");
      }
    }
  };

  const updateDetails = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), adminData);
        toast.success("Profile details updated successfully!");
      } catch (error) {
        console.error("Error updating profile details:", error);
        toast.error("Error updating profile details.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (croppedImage) {
        await updatePhoto();
      }
      await updateDetails();
      navigate("/admin/profile");
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Error saving changes.");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="edit-admin-profile-container">
      <div className="profile-photo-container">
        <img src={adminData.photo || "./assets/images/default-photo.png"} alt="Profile" className="profile-photo" />
      </div>
      <h2 className="text-center">Edit Admin Profile</h2>
      <form onSubmit={handleSubmit} className="text-center admin-form-control">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={adminData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={adminData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={adminData.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={adminData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={adminData.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={adminData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo" className="form-label">Profile Picture</label>
          <input
            type="file"
            className="form-control"
            id="photo"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {showCropper && (
          <div className="cropper-container">
            <Cropper
              src={selectedImage}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
            <button type="button" onClick={handleCrop} className="btn btn-primary mt-2">
              Crop Image
            </button>
          </div>
        )}
        {showUploadPopup && (
          <div className="upload-popup text-center">
            <img src={croppedImage} alt="Cropped" style={{ width: '100%' }} />
            <button type="button" onClick={updatePhoto} className="btn btn-primary mt-2">
              Upload Photo
            </button>
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-2">
          Save Changes
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditAdminProfile;

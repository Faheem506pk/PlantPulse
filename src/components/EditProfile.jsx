import React, { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../hooks/useFirebaseData";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProfile() {
  const [userDetails, setUserDetails] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false); // Manage cropper visibility
  const [showUploadPopup, setShowUploadPopup] = useState(false); // Manage upload popup visibility
  const cropperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setShowCropper(true); // Show cropper
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL("image/jpeg");
      setCroppedImage(croppedImageUrl);
      setShowCropper(false); // Hide cropper after cropping
      setShowUploadPopup(true); // Show upload popup
    }
  };

  const updatePhoto = async () => {
    const user = auth.currentUser;
    if (user && croppedImage) {
      const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const photoURL = await getDownloadURL(storageRef);

      // Update photo URL in Firestore
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { photo: photoURL });
        setUserDetails((prevDetails) => ({ ...prevDetails, photo: photoURL }));
        setCroppedImage(null); // Clear cropped image
        setShowUploadPopup(false); // Hide upload popup
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
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phone: userDetails.phone,
          city: userDetails.city,
          address: userDetails.address,
        });
        toast.success("Profile details updated successfully!");
      } catch (error) {
        console.error("Error updating profile details:", error);
        toast.error("Error updating profile details.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (croppedImage) {
      await updatePhoto();
    }
    await updateDetails();
    navigate("/profile"); // Redirect to /profile after update
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="main-wrapper">
      <div className="container ">
        <div className="row gutters-sm">
          <div className="col-lg-4 col-md-5 profile-n">
            <div className="card profile-card glass-effect d-flex justify-content-center flex-column align-items-center ">
              <div className="card-body d-flex align-items-center flex-column justify-content-center">
                <div className="text-center mb-4">
                  <img
                    src={userDetails.photo || './assets/images/default-photo.png'}
                    alt="Profile"
                    className="img-fluid rounded-circle profile-image"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-7">
            <div className="card profile-card glass-effect">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {showCropper && selectedImage && (
                    <div className="cropper-popup">
                      <Cropper
                        src={selectedImage}
                        style={{ height: 400, width: '100%' }}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                      />
                      <button type="button" onClick={handleCrop} className="btn btn-secondary mt-2">
                        Crop Image
                      </button>
                    </div>
                  )}
                  {showUploadPopup && croppedImage && (
                    <div className="upload-popup">
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        style={{ maxWidth: "100%" }}
                      />
                      <button type="button" onClick={updatePhoto} className="btn btn-secondary mt-2">
                        Upload Photo
                      </button>
                    </div>
                  )}
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">First Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="firstName"
                        value={userDetails.firstName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Last Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="lastName"
                        value={userDetails.lastName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Phone</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        className="form-control"
                        maxLength="11"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">City</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="city"
                        value={userDetails.city}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Address</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="address"
                        value={userDetails.address}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to display toasts */}
    </main>
  );
}

export default EditProfile;

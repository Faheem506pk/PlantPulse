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
  const [showCropper, setShowCropper] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const cropperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            if (isMounted) {
              setUserDetails(docSnap.data());
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error fetching user data.");
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchUserData();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
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
        setUserDetails(prevDetails => ({ ...prevDetails, photo: photoURL }));
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
        await updateDoc(doc(db, "users", user.uid), {
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
    try {
      if (croppedImage) {
        await updatePhoto();
      }
      await updateDetails();
      navigate("/profile");
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Error saving changes.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="main-wrapper">
      <div className="profile-cd d-flex justify-content-center align-items-center">
        <div className="row w-100">
          <div className="col-lg-5 col-md-5 profile-n">
            <div className="card profile-card glass-effect d-flex justify-content-center flex-column align-items-center">
              <div className="card-body profile-w d-flex align-items-center flex-column justify-content-center">
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
          <div className="col-lg-7 col-md-7">
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
                  <div className="form-group mb-3">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userDetails.firstName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userDetails.lastName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                      className="form-control"
                      maxLength="11"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={userDetails.city}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userDetails.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}

export default EditProfile;

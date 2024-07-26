import React, { useState, useRef } from 'react';
import { auth, db, storage } from "../hooks/useFirebaseData";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddNewPresets() {
  const [formData, setFormData] = useState({
    photo: '',
    name: '',
    tempup: '',
    tempdown: '',
    moistureup: '',
    moisturedown: '',
    humidup: '',
    humiddown: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [errors, setErrors] = useState({
    tempup: '',
    moistureup: '',
    humidup: ''
  });
  const cropperRef = useRef(null);

  const validateValue = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = parseInt(value);
    let updatedFormData = { ...formData };
    let validationErrors = { ...errors };

    if (isNaN(newValue)) {
      newValue = '';
    }

    switch (name) {
      case "tempup":
       
        updatedFormData.tempup = newValue;
        updatedFormData.tempdown = newValue - 2;
        validationErrors.tempup = newValue < 10 || newValue > 50 ? "Temperature Up must be between 10 and 50." : "";
        break;
      case "moistureup":
        
        updatedFormData.moistureup = newValue;
        updatedFormData.moisturedown = newValue - 10;
        validationErrors.moistureup = newValue < 10 || newValue > 100 ? "Moisture Up must be between 10 and 100." : "";
        break;
      case "humidup":
        
        updatedFormData.humidup = newValue;
        updatedFormData.humiddown = newValue - 10;
        validationErrors.humidup = newValue < 10 || newValue > 100 ? "Humidity Up must be between 10 and 100." : "";
        break;
      default:
        updatedFormData[name] = value;
    }

    setErrors(validationErrors);
    setFormData(updatedFormData);
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

  const uploadImage = async () => {
    const storageRef = ref(storage, `presets/${new Date().getTime()}.jpg`);
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const photoURL = await getDownloadURL(storageRef);
      setCroppedImage(null);
      setShowUploadPopup(false);
      toast.success("Preset photo uploaded successfully!");
      return photoURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = formData.photo;

      if (croppedImage) {
        const uploadedPhotoURL = await uploadImage();
        if (!uploadedPhotoURL) return;
        photoURL = uploadedPhotoURL;
      }

      if (errors.tempup || errors.moistureup || errors.humidup) {
        toast.error("Please fix the errors before submitting.", { position: "bottom-center" });
        return;
      }

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "presets", new Date().getTime().toString()), {
          ...formData,
          photo: photoURL
        });

        // Reset form data
        setFormData({
          photo: '',
          name: '',
          tempup: '',
          tempdown: '',
          moistureup: '',
          moisturedown: '',
          humidup: '',
          humiddown: ''
        });

        setErrors({
          tempup: '',
          moistureup: '',
          humidup: ''
        });

        toast.success("Preset added successfully!", { position: "top-center" });
      } else {
        toast.error("User not authenticated.", { position: "bottom-center" });
      }
    } catch (error) {
      console.error("Error adding preset:", error);
      toast.error("Error adding preset.", { position: "bottom-center" });
    }
  };

  const handleClear = () => {
    // Clear form data
    setFormData({
      photo: '',
      name: '',
      tempup: '',
      tempdown: '',
      moistureup: '',
      moisturedown: '',
      humidup: '',
      humiddown: ''
    });

    // Clear any selected or cropped image
    setSelectedImage(null);
    setCroppedImage(null);
    setShowCropper(false);
    setShowUploadPopup(false);
    setErrors({
      tempup: '',
      moistureup: '',
      humidup: ''
    });
  };

  return (
    <div className="add-new-presets-container mt-4 d-flex justify-content-center">
      <div className="add-new-presets-form col-lg-8 col-md-10 col-sm-12">
        <ToastContainer />
        <h3 className="add-new-presets-title mb-4 text-center">Add New Preset</h3>
        <form onSubmit={handleSubmit}>
          <div className="add-new-presets-file mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          {showCropper && (
            <div className="add-new-presets-cropper mb-3">
              <Cropper
                src={selectedImage}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
              />
              <button
                type="button"
                className="add-new-presets-crop-btn btn btn-primary mt-2"
                onClick={handleCrop}
              >
                Crop Image
              </button>
            </div>
          )}
          {showUploadPopup && (
            <div className="add-new-presets-upload-popup mt-2 text-center">
              <img src={croppedImage} alt="Cropped" className="add-new-presets-upload-img" />
              <button
                type="button"
                className="add-new-presets-upload-btn btn btn-success mt-2"
                onClick={() => setShowUploadPopup(false)}
              >
                Use Image
              </button>
            </div>
          )}
          <div className="add-new-presets-name mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="form-control"
            />
          </div>
          <div className="add-new-presets-tempup mb-3">
            <input
              type="number"
              name="tempup"
              value={formData.tempup}
              onChange={handleChange}
              placeholder="Temperature Up"
              className="form-control"
              min="10"
              max="50"
              step="1"
            />
            {errors.tempup && <small className="text-danger">{errors.tempup}</small>}
          </div>
          <div className="add-new-presets-tempdown mb-3">
            <input
              type="number"
              name="tempdown"
              value={formData.tempdown}
              onChange={handleChange}
              placeholder="Temperature Down"
              className="form-control"
              min="8"
              max="48"
              step="1"
              disabled
            />
          </div>
          <div className="add-new-presets-moistureup mb-3">
            <input
              type="number"
              name="moistureup"
              value={formData.moistureup}
              onChange={handleChange}
              placeholder="Moisture Up"
              className="form-control"
              min="10"
              max="100"
              step="1"
            />
            {errors.moistureup && <small className="text-danger">{errors.moistureup}</small>}
          </div>
          <div className="add-new-presets-moisturedown mb-3">
            <input
              type="number"
              name="moisturedown"
              value={formData.moisturedown}
              onChange={handleChange}
              placeholder="Moisture Down"
              className="form-control"
              min="0"
              max="90"
              step="1"
              disabled
            />
          </div>
          <div className="add-new-presets-humidup mb-3">
            <input
              type="number"
              name="humidup"
              value={formData.humidup}
              onChange={handleChange}
              placeholder="Humidity Up"
              className="form-control"
              min="10"
              max="100"
              step="1"
            />
            {errors.humidup && <small className="text-danger">{errors.humidup}</small>}
          </div>
          <div className="add-new-presets-humiddown mb-3">
            <input
              type="number"
              name="humiddown"
              value={formData.humiddown}
              onChange={handleChange}
              placeholder="Humidity Down"
              className="form-control"
              min="0"
              max="90"
              step="1"
              disabled
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary me-2">Add Preset</button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

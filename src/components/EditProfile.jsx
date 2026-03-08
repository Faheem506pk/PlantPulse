import React, { useState, useEffect, useRef, useContext } from "react";
import { auth, db, storage } from "../hooks/useFirebaseData";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from "./UserContext";
import { User, Phone, MapPin, Building, Save, Camera, ArrowLeft, Crop } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function EditProfile() {
  const { userDetails, setUserDetails, loading } = useContext(UserContext);
  const [localUserDetails, setLocalUserDetails] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const cropperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setLocalUserDetails(userDetails);
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
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
        setLocalUserDetails(prevDetails => ({ ...prevDetails, photo: photoURL }));
        setCroppedImage(null);
        toast.success("Identity visual updated");
      } catch (error) {
        toast.error("Visual update failed");
      }
    }
  };

  const updateDetails = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          firstName: localUserDetails.firstName,
          lastName: localUserDetails.lastName,
          phone: localUserDetails.phone,
          city: localUserDetails.city,
          address: localUserDetails.address,
        });
        setUserDetails(localUserDetails);
        toast.success("Metadata synchronized");
      } catch (error) {
        toast.error("Synchronization failed");
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
      toast.error("Operation failed");
    }
  };

  const InputField = ({ icon: Icon, label, name, value, onChange, placeholder, maxLength }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <Icon className="w-3 h-3 text-brand-neon" />
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full bg-brand-deep border border-brand-muted/50 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-neon/50 focus:ring-1 focus:ring-brand-neon/20 outline-none transition-all placeholder:text-zinc-600"
      />
    </div>
  );

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastContainer theme="dark" />
      
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/profile")} className="border-brand-muted hover:bg-brand-muted/50">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Button>
          <div>
            <h2 className="text-4xl font-black text-white glow-text tracking-tighter">Modify Metadata</h2>
            <p className="text-zinc-500 mt-2 font-medium">Update your authorized system identifying details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Left: Avatar Upload */}
        <Card className="glass-card border-brand-muted h-fit">
          <CardContent className="pt-10 flex flex-col items-center">
            <div className="relative group/avatar mb-8">
              <div className="absolute -inset-1 bg-brand-neon rounded-full blur opacity-25 shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
              <img 
                src={croppedImage || localUserDetails.photo || './assets/images/default-photo.png'} 
                alt="Profile" 
                className="relative w-40 h-40 rounded-full border-2 border-brand-neon/50 object-cover"
              />
              <label className="absolute bottom-2 right-2 bg-brand-neon p-3 rounded-full border-2 border-brand-deep text-brand-deep cursor-pointer hover:scale-110 transition-transform shadow-xl">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center leading-relaxed">
              Standard Interface Identification <br/> 400x400 Dynamic Crop
            </p>
          </CardContent>
        </Card>

        {/* Right: Form Data */}
        <Card className="lg:col-span-2 glass-card border-brand-muted">
          <CardContent className="pt-8 px-8 pb-10">
            {showCropper && selectedImage && (
              <div className="mb-10 p-4 rounded-2xl bg-brand-deep border border-brand-neon/30 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-brand-neon uppercase tracking-widest flex items-center gap-2">
                    <Crop className="w-3 h-3" /> Visual Crop Required
                  </span>
                </div>
                <Cropper
                  src={selectedImage}
                  style={{ height: 300, width: '100%' }}
                  aspectRatio={1}
                  guides={false}
                  ref={cropperRef}
                  className="rounded-lg overflow-hidden"
                />
                <Button type="button" onClick={handleCrop} className="w-full mt-4 bg-brand-neon text-brand-deep font-bold hover:glow-green transition-all">
                  Apply Identity Visual
                </Button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <InputField icon={User} label="First Identification" name="firstName" value={localUserDetails.firstName} onChange={handleChange} placeholder="Givven identity" />
              <InputField icon={User} label="Secondary Identification" name="lastName" value={localUserDetails.lastName} onChange={handleChange} placeholder="Family identity" />
              <InputField icon={Phone} label="Contact Frequency" name="phone" value={localUserDetails.phone} onChange={handleChange} maxLength="11" placeholder="923XXXXXXXXX" />
              <InputField icon={Building} label="Sector/City" name="city" value={localUserDetails.city} onChange={handleChange} placeholder="Metropolitan area" />
              <div className="sm:col-span-2">
                <InputField icon={MapPin} label="Geospatial Address" name="address" value={localUserDetails.address} onChange={handleChange} placeholder="Physical operational base" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-brand-muted/50">
              <Button type="button" variant="outline" onClick={() => navigate("/profile")} className="border-brand-muted text-zinc-400 px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-muted/20">
                Discard
              </Button>
              <Button type="submit" className="bg-brand-neon hover:bg-brand-neon/80 text-brand-deep font-bold px-10 py-6 rounded-xl group relative overflow-hidden transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Synchronize Metadata
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default EditProfile;

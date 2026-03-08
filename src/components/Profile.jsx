import React, { useEffect, useState } from "react";
import { auth, db } from "../hooks/useFirebaseData";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { GoogleAuthProvider, reauthenticateWithPopup, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { User, Mail, Phone, MapPin, Building, LogOut, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            setUserDetails({
              photo: "./assets/images/default-photo.png",
              firstName: "User",
              lastName: "",
              email: user.email,
              phone: "--",
              city: "--",
              address: "--",
            });
          }
        } catch (error) {
          toast.error("Error fetching profile data");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  async function handleDeleteAccount() {
    if (window.confirm("CRITICAL: This will permanently delete your IoT profile and all associated data. Continue?")) {
      try {
        const user = auth.currentUser;
        if (user.providerData[0].providerId === "password") {
          const pass = prompt("Verification required. Enter password:");
          if (!pass) return;
          const credential = EmailAuthProvider.credential(user.email, pass);
          await reauthenticateWithCredential(user, credential);
        } else if (user.providerData[0].providerId === "google.com") {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(user, provider);
        }

        await deleteDoc(doc(db, "users", user.uid));
        await user.delete();
        navigate("/login");
        toast.success("Account terminated");
      } catch (error) {
        toast.error(`Termination failed: ${error.message}`);
      }
    }
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-brand-muted/20 border border-brand-muted/30 group hover:border-brand-neon/30 transition-all duration-300">
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        <Icon className="w-3 h-3 text-brand-neon" />
        {label}
      </div>
      <div className="text-sm font-bold text-white tracking-tight">{value || "--"}</div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <ToastContainer theme="dark" />
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white glow-text tracking-tighter">Identity Profile</h2>
          <p className="text-zinc-500 mt-2 font-medium">Manage your system authorization and metadata</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-brand-muted text-zinc-400 hover:text-white hover:bg-brand-muted/50 font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <Trash2 className="w-3 h-3" /> Terminate
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Avatar Card */}
        <Card className="glass-card border-brand-muted relative overflow-hidden group h-fit">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-neon/5 to-transparent opacity-50" />
          <CardContent className="pt-10 flex flex-col items-center relative z-10">
            <div className="relative group/avatar cursor-pointer mb-6">
              <div className="absolute -inset-1 bg-brand-neon rounded-full blur opacity-25 group-hover/avatar:opacity-50 transition duration-1000 group-active:duration-200" />
              <img 
                src={userDetails?.photo || './assets/images/default-photo.png'} 
                alt="Profile" 
                className="relative w-32 h-32 rounded-full border-2 border-brand-neon/50 object-cover"
              />
              <Link to="/edit-profile" className="absolute bottom-1 right-1 bg-brand-neon p-2 rounded-full border-2 border-brand-deep text-brand-deep hover:scale-110 transition-transform">
                <Edit3 className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-2xl font-bold text-white glow-text text-center">
              {userDetails?.firstName} {userDetails?.lastName}
            </h3>
            <div className="mt-2 text-[10px] font-black text-brand-neon border border-brand-neon/30 px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.1)]">
              Authorized Member
            </div>
            
            <div className="w-full mt-10 pt-10 border-t border-brand-muted/50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-500">Security Clearance</span>
                <span className="text-brand-neon">Lvl 4 (Premium)</span>
              </div>
              <div className="h-1.5 w-full bg-brand-muted/30 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-brand-neon shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Personal Data */}
        <Card className="lg:col-span-2 glass-card border-brand-muted">
          <CardContent className="pt-8 px-8 pb-10">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-brand-muted/50">
              <ShieldAlert className="w-5 h-5 text-brand-neon" />
              <div>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">System Metadata</h4>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Personal Identification Details</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <InfoRow icon={User} label="First Identification" value={userDetails?.firstName} />
              <InfoRow icon={User} label="Secondary Identification" value={userDetails?.lastName} />
              <InfoRow icon={Mail} label="Transmission Email" value={userDetails?.email} />
              <InfoRow icon={Phone} label="Contact Frequency" value={userDetails?.phone} />
              <InfoRow icon={Building} label="Sector/City" value={userDetails?.city} />
              <InfoRow icon={MapPin} label="Geospatial Address" value={userDetails?.address} />
            </div>

            <div className="mt-12 flex justify-end">
              <Button asChild className="bg-brand-neon hover:bg-brand-neon/80 text-brand-deep font-bold px-8 py-6 rounded-xl group relative overflow-hidden transition-all duration-300">
                <Link to="/edit-profile">
                  <span className="relative z-10 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Modify Metadata
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;

import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../hooks/useFirebaseData";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { User, Mail, Lock, ShieldPlus, ArrowRight, Leaf, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
          role: "user",
          access: false
        });
      }
      toast.success("Identity Created: Authorization Pending");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 py-10 flex flex-col">
      <ToastContainer theme="dark" />
      
      <div className="w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-brand-neon p-4 rounded-2xl glow-green shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
            <Leaf className="w-10 h-10 text-brand-deep" />
          </div>
          <h1 className="text-4xl font-black text-white glow-text tracking-tighter mb-2">PlantPulse</h1>
        </div>

        <Card className="glass-card border-brand-muted relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/10 via-transparent to-transparent opacity-50" />
          <CardContent className="pt-10 px-8 pb-10 relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                <ShieldPlus className="w-6 h-6 text-brand-neon" />
                Register
              </h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3" />
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex"
                    onChange={(e) => setFname(e.target.value)}
                    className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-neon/50 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Rivera"
                    onChange={(e) => setLname(e.target.value)}
                    className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-neon/50 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-neon/50 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-neon/50 outline-none transition-all placeholder:text-zinc-700 font-mono"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-neon hover:bg-brand-neon/80 text-brand-deep font-black py-7 rounded-xl group relative overflow-hidden transition-all duration-300 mt-4"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                  {isSubmitting ? "Processing..." : "Register"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-brand-muted/50 text-center">
              <p className="text-zinc-500 text-xs">
                Already part of the network?{" "}
                <Link to="/login" className="text-brand-neon font-bold hover:underline">
                  Login Here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;

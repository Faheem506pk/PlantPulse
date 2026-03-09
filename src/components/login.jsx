import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../hooks/useFirebaseData";
import { toast, ToastContainer } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { Mail, Lock, ArrowRight, ShieldCheck, Leaf, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SignInwithGoogle from "./signInWIthGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        const access = userData.access;

        if (role === 'admin') {
          toast.success("Terminal access granted: Admin");
          navigate("/admin");
        } else {
          if (access === false) {
            await auth.signOut();
            toast.error("Access denied: Authorization pending");
          } else {
            toast.success("Identity verified: Welcome back");
            navigate("/dashboard");
          }
        }
      } else {
        toast.error("Identity unknown: Record not found");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 py-10 flex flex-col">
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


            <form onSubmit={handleSubmit} className="space-y-6 p-0">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-neon/50 focus:ring-1 focus:ring-brand-neon/20 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3" />
                    Password
                  </label>
                  <Link to="/forgotpassword" title="Recover Identification" className="text-[10px] font-bold text-brand-neon hover:underline tracking-widest uppercase opacity-70">
                    Recover
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-brand-deep/50 border border-brand-muted/50 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-neon/50 focus:ring-1 focus:ring-brand-neon/20 outline-none transition-all placeholder:text-zinc-700 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-neon hover:bg-brand-neon/80 text-brand-deep font-black py-7 rounded-xl group relative overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                  {isSubmitting ? "Verifying..." : "Login"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-brand-muted/50">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center mx-auto" >
                  <SignInwithGoogle />
                </div>
                <Button asChild variant="outline" className="w-full border-brand-muted text-zinc-400 hover:text-white hover:bg-brand-muted/30 py-6 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center flex items-center justify-center gap-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
          <Globe className="w-3 h-3" />
          Secure Global IoT Monitoring Network
        </div>
      </div>
    </div>
  );
}

export default Login;

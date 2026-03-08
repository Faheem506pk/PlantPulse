import React, { useContext, useState, useEffect } from 'react';
import { Search, Bell, User, Menu, LogOut, Thermometer, Droplets, Droplet, Leaf } from 'lucide-react';
import { UserContext } from './UserContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFirebaseData, auth } from '../hooks/useFirebaseData';
import { cn } from '@/lib/utils';

const Topbar = ({ toggleSidebar }) => {
  const { userDetails } = useContext(UserContext);
  const { temperature, humidity, moisture } = useFirebaseData();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="h-20 border-b border-brand-muted bg-brand-deep/80 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between transition-all duration-300 w-full group/header">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden text-white hover:bg-white/10 shrink-0">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden lg:flex items-center gap-2 group cursor-default">
          <div className="bg-brand-neon/10 p-1.5 rounded-lg border border-brand-neon/20">
            <Leaf className="w-4 h-4 text-brand-neon glow-green" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">PlantPulse</span>
        </div>

        <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 bg-brand-surface/50 border border-brand-muted rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2 px-3 border-r border-brand-muted last:border-0 group/chip cursor-default">
            <Thermometer className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-white tabular-nums">{temperature}°C</span>
          </div>
          <div className="flex items-center gap-2 px-3 border-r border-brand-muted last:border-0 group/chip cursor-default">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-bold text-white tabular-nums">{humidity}%</span>
          </div>
          <div className="flex items-center gap-2 px-3 border-r border-brand-muted last:border-0 group/chip cursor-default">
            <Droplet className="w-3.5 h-3.5 text-brand-neon" />
            <span className="text-xs font-bold text-white tabular-nums">{moisture}%</span>
          </div>
        </div>

        <div className="flex items-center flex-1 max-w-sm relative group hidden md:flex">
          <Search className="absolute left-4 w-4 h-4 text-zinc-500 group-focus-within:text-brand-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search telemetry..." 
            className="w-full bg-brand-surface/30 border border-brand-muted rounded-full py-2 pl-11 pr-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-neon transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-surface/30 rounded-lg border border-brand-muted/50 cursor-default">
          <span className="text-[10px] font-black tracking-widest text-brand-neon uppercase opacity-50">Local Node</span>
          <span className="text-xs font-bold text-white tabular-nums">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        <button className="relative p-2 text-zinc-400 hover:text-brand-neon transition-colors hidden xs:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-neon rounded-full border-2 border-brand-deep glow-green animate-pulse" />
        </button>

        <div className="h-8 w-px bg-brand-muted hidden xs:block" />

        <div className="flex items-center gap-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-brand-neon transition-colors tracking-tight leading-none text-right">
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
            <p className="text-[10px] font-bold text-brand-neon uppercase tracking-widest mt-1 text-right opacity-80">
              {userDetails?.city || 'System Operator'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-brand-muted p-0.5 group-hover:border-brand-neon transition-colors overflow-hidden shrink-0 relative cursor-pointer">
            <div className="w-full h-full bg-brand-surface rounded-full flex items-center justify-center overflow-hidden">
              {userDetails?.photo ? (
                <img src={userDetails.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-zinc-500 group-hover:text-brand-neon" />
              )}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button 
                className="p-2 text-zinc-500 hover:text-red-500 transition-colors group-hover:bg-red-500/10 rounded-lg"
                title="Disconnect Terminal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-brand-muted">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white glow-text">Disconnect Terminal</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  Are you sure you want to log out of the PlantPulse system?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-brand-surface border-brand-muted text-white hover:bg-brand-muted">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">Disconnect</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

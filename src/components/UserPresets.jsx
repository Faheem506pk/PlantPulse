import React, { useEffect, useState } from 'react';
import { db, rtdb } from '../hooks/useFirebaseData';
import { collection, getDocs } from 'firebase/firestore';
import { ref, update } from 'firebase/database';
import { toast, ToastContainer } from "react-toastify";
import { ThermometerSun, Droplets, Droplet, CheckCircle2, ShieldCheck, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HARDCODED_PASSWORD = "mcb121450";

export default function UserPresets() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const presetsCollection = collection(db, 'presets');
        const presetsSnapshot = await getDocs(presetsCollection);
        const presetsList = presetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPresets(presetsList);
      } catch (error) {
        console.error('Error fetching presets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  const initiateApplyPreset = (preset) => {
    setSelectedPreset(preset);
    setIsDialogOpen(true);
    setPassword("");
  };

  const confirmApplyPreset = async () => {
    if (password === HARDCODED_PASSWORD) {
      try {
        const dataToUpdate = {
          tempup: selectedPreset.tempup, tempdown: selectedPreset.tempdown,
          moistureup: selectedPreset.moistureup, moisturedown: selectedPreset.moisturedown,
          humidup: selectedPreset.humidup, humiddown: selectedPreset.humiddown
        };
        await update(ref(rtdb), dataToUpdate);
        toast.success(`Active configuration updated: ${selectedPreset.name}`);
        setIsDialogOpen(false);
      } catch (error) {
        toast.error('Failed to update system parameters');
      }
    } else {
      toast.error("Invalid security code");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastContainer theme="dark" />
      
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white glow-text">Environmental Presets</h2>
        <p className="text-zinc-500 mt-1">Pre-configured optimizations for different plant varieties</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {presets.length > 0 ? presets.map(preset => (
          <Card key={preset.id} className="glass-card overflow-hidden group hover:border-brand-neon/50 transition-all duration-500 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={preset.photo || './assets/images/default-photo.png'} 
                alt={preset.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="bg-brand-neon p-2 rounded-lg">
                  <Flower2 className="w-4 h-4 text-brand-deep" />
                </div>
                <h3 className="text-xl font-bold text-white glow-text">{preset.name}</h3>
              </div>
            </div>
            
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <ThermometerSun className="w-3 h-3" /> Temp Range
                  </p>
                  <p className="text-sm font-bold text-white">{preset.tempdown}°C - {preset.tempup}°C</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Droplet className="w-3 h-3" /> Moisture
                  </p>
                  <p className="text-sm font-bold text-white">{preset.moisturedown}% - {preset.moistureup}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Humidity
                  </p>
                  <p className="text-sm font-bold text-white">{preset.humiddown}% - {preset.humidup}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Security
                  </p>
                  <p className="text-sm font-bold text-brand-neon">Protected</p>
                </div>
              </div>

              <Button 
                onClick={() => initiateApplyPreset(preset)}
                className="w-full bg-brand-neon hover:bg-brand-neon/80 text-brand-deep font-bold mt-auto group/btn overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Configuration
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
              </Button>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-brand-muted rounded-2xl">
            <p className="text-zinc-500 font-medium">No presets available currently</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-brand-muted text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 tracking-tight">
              <ShieldCheck className="w-5 h-5 text-brand-neon" />
              Security Verification
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter the master security code to synchronize this preset with your hardware.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password"
              placeholder="Enter security code..."
              className="bg-brand-deep/50 border-brand-muted text-white focus:border-brand-neon transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmApplyPreset()}
            />
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={confirmApplyPreset} className="bg-brand-neon text-brand-deep font-bold hover:bg-brand-neon/90">
              Authenticate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

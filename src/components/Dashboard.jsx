import React, { useState, useMemo } from "react";
import { useFirebaseData } from "../hooks/useFirebaseData";
import { useEsp32Data } from "../hooks/useEsp32Data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  ThermometerSun, Droplets, Droplet, Sun, Settings, 
  Activity, Power, Wind, Zap, Bell, CheckCircle2, Lightbulb
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// Simulated historical data for high-end visualization
const generateSimulatedData = (currentVal = 25) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    temp: currentVal - 2 + Math.random() * 2,
    humi: 50 + Math.random() * 5,
    mois: 30 + Math.random() * 5,
  }));
};

const PremiumMetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
  <Card className="glass-card overflow-hidden group hover:border-brand-neon/50 transition-all duration-500">
    <CardContent className="h-full pt-6">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg transition-all duration-500 group-hover:scale-110", color)}>
          <Icon className="w-5 h-5 text-brand-deep" />
        </div>
        <div className="flex flex-col items-end">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
            trend > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{title}</p>
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-4">
        <h3 className="text-3xl font-bold text-white group-hover:glow-text transition-all duration-300">{value}</h3>
        <span className="text-zinc-500 text-sm font-medium">{unit}</span>
      </div>

      <div className="h-12 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={generateSimulatedData(parseFloat(value) || 25).slice(-8)}>
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="currentColor" 
              strokeWidth={2} 
              dot={false}
              className={cn(color.replace('bg-', 'text-'))}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { userDetails } = React.useContext(UserContext);
  const {
    temperature, humidity, ldr, moisture, servo, setData
  } = useFirebaseData();

  const { writeServoAngleData } = useEsp32Data();
  const [selectedRange, setSelectedRange] = useState('24H');
  const [autoWatering, setAutoWatering] = useState(true);
  const [growLights, setGrowLights] = useState(false);

  const trendData = useMemo(() => {
    const points = selectedRange === '24H' ? 24 : selectedRange === '7D' ? 7 : 30;
    return generateSimulatedData(parseFloat(temperature) || 25, points);
  }, [temperature, selectedRange]);

  return (
    <div className="flex-1 bg-brand-deep min-h-screen p-8 space-y-8 animate-in fade-in duration-700">
      <ToastContainer theme="dark" />
      
      {/* SVG Filters for Glow Effects */}
      <svg className="absolute w-0 h-0 overflow-hidden">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <PremiumMetricCard 
          title="Temperature" 
          value={temperature} 
          unit="°C" 
          icon={ThermometerSun} 
          color="bg-amber-500" 
          trend={2.4}
        />
        <PremiumMetricCard 
          title="Humidity" 
          value={humidity} 
          unit="%" 
          icon={Droplets} 
          color="bg-blue-500" 
          trend={-1.2}
        />
        <PremiumMetricCard 
          title="Soil Moisture" 
          value={moisture} 
          unit="%" 
          icon={Droplet} 
          color="bg-teal-500" 
          trend={5.1}
        />
        <PremiumMetricCard 
          title="Light Intensity" 
          value={ldr === "light" ? "High" : "Low"} 
          unit="" 
          icon={Sun} 
          color="bg-yellow-500" 
          trend={10.2}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Trends Chart */}
        <Card className="lg:col-span-2 glass-card p-6 border-brand-muted relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white glow-text">Environmental Trends</h3>
              <p className="text-xs text-zinc-500 mt-1">System overview over the last 24 hours</p>
            </div>
            <div className="flex bg-brand-muted/50 p-1 rounded-lg border border-brand-muted">
              {['24H', '7D', '30D'].map((range) => (
                <button 
                  key={range}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                    range === '24H' ? "bg-brand-neon text-brand-deep shadow-lg overflow-hidden relative" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2E1A" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={3}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A120A', border: '1px solid #1A2E1A', borderRadius: '8px' }}
                  itemStyle={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#22C55E" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGreen)" 
                  animationDuration={2000}
                  filter="url(#glow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Control & Activity Panel */}
        <div className="space-y-8">
          <Card className="glass-card p-6 border-brand-muted">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-5 h-5 text-brand-neon animate-spin-slow" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Device Controls</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Servo Motor Angle</label>
                  <span className="text-brand-neon font-bold text-sm bg-brand-neon/10 px-2 py-0.5 rounded">{servoVal}°</span>
                </div>
                <Slider 
                  value={[servoVal]} 
                  onValueChange={(vals) => setServoVal(vals[0])}
                  onValueCommit={(vals) => {
                    writeServoAngleData(vals[0]);
                    toast.success(`Servo set to ${vals[0]}°`);
                  }}
                  max={180} 
                  step={1} 
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-bold">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-brand-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className={cn("w-4 h-4 transition-colors", autoWatering ? "text-brand-neon" : "text-zinc-600")} />
                    <span className="text-xs font-bold text-white">Auto-Watering</span>
                  </div>
                  <Switch checked={autoWatering} onCheckedChange={setAutoWatering} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className={cn("w-4 h-4 transition-colors", growLights ? "text-brand-neon" : "text-zinc-600")} />
                    <span className="text-xs font-bold text-white">Grow Lights</span>
                  </div>
                  <Switch checked={growLights} onCheckedChange={setGrowLights} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 border-brand-muted">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-brand-neon" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Recent Activity</h3>
              </div>
              <span className="text-[8px] font-black text-brand-neon border border-brand-neon px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
            </div>
            
            <div className="space-y-4">
              {[
                { time: 'System Active', text: 'Telemetry synchronization active', icon: CheckCircle2 },
                { time: 'Auth Level 4', text: `Authorized: ${userDetails?.firstName}`, icon: Power },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={cn("w-1 h-10 rounded-full transition-all duration-300", 
                    log.alert ? "bg-red-500" : "bg-brand-muted group-hover:bg-brand-neon"
                  )} />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-brand-neon transition-colors">{log.text}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-medium">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

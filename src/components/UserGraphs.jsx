import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, Activity, ThermometerSun, Droplets, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer } from "react-toastify";

function UserGraphs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('day');

  const getFilteredData = (data, filter) => {
    const now = new Date();
    const startDate = new Date();
    switch (filter) {
      case 'day': startDate.setDate(now.getDate() - 1); break;
      case 'week': startDate.setDate(now.getDate() - 7); break;
      case 'month': startDate.setMonth(now.getMonth() - 1); break;
      default: break;
    }
    return data.filter(row => {
      const rowDate = new Date(row.Date + ' ' + row.Time);
      return rowDate >= startDate && rowDate <= now;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/yy0chtmjxx9dz");
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(getFilteredData(result, filter));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const chartData = useMemo(() => data.map(row => ({
    time: row.Time.slice(0, 5),
    temp: parseFloat(row.Temperature) || 0,
    humi: parseFloat(row.Humidity) || 0,
    mois: parseFloat(row.MoistureValue) || 0,
  })), [data]);

  const ChartSection = ({ title, dataKey, color, icon: Icon }) => (
    <Card className="glass-card p-6 mb-8 border-brand-muted group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
          <Activity className="w-3 h-3 animate-pulse text-brand-neon" />
          Real-time Analytics
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color.includes('green') ? '#22C55E' : color.includes('blue') ? '#3B82F6' : '#F59E0B'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color.includes('green') ? '#22C55E' : color.includes('blue') ? '#3B82F6' : '#F59E0B'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2E1A" vertical={false} />
            <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval={Math.floor(chartData.length / 6)} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0A120A', border: '1px solid #1A2E1A', borderRadius: '8px' }}
              itemStyle={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color.includes('green') ? '#22C55E' : color.includes('blue') ? '#3B82F6' : '#F59E0B'} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#color${dataKey})`}
              filter="url(#glow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastContainer theme="dark" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white glow-text">Historical Analytics</h2>
          <p className="text-zinc-500 mt-1">Detailed performance tracking across sensors</p>
        </div>
        
        <div className="flex items-center gap-2 bg-brand-muted/50 p-1.5 rounded-xl border border-brand-muted self-start">
          {['day', 'week', 'month'].map((t) => (
            <button
              key={t}
              onClick={() => { setLoading(true); setFilter(t); }}
              className={cn(
                "px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all",
                filter === t ? "bg-brand-neon text-brand-deep shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <ChartSection title="Temperature Analysis" dataKey="temp" color="text-amber-500" icon={ThermometerSun} />
        <ChartSection title="Humidity Trends" dataKey="humi" color="text-blue-500" icon={Droplets} />
        <ChartSection title="Soil Moisture Feed" dataKey="mois" color="text-teal-500" icon={Droplet} />
      </div>
    </div>
  );
}


export default UserGraphs;

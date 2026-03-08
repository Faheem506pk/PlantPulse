import React from 'react';
import { LayoutDashboard, BarChart3, Construction, Users, Settings, Leaf, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Analytics', icon: BarChart3, path: '/graphs' },
    { title: 'Hardware', icon: Construction, path: '/presets' },
    { title: 'Profile', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="w-64 border-r border-brand-muted bg-brand-deep flex flex-col h-screen fixed inset-y-0 z-50">
      <div className="px-6 py-8">
        <Link to="/" className="flex items-center gap-2 mb-8 group cursor-pointer px-4">
          <div className="bg-brand-neon p-2 rounded-lg glow-green shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Leaf className="w-6 h-6 text-brand-deep" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tighter glow-text">PlantPulse</h2>
            <p className="text-[10px] text-brand-neon font-black tracking-widest uppercase opacity-80">Premium IoT</p>
          </div>
        </Link>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.title} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 transition-all duration-300 px-4",
                    isActive 
                      ? "bg-brand-neon/10 text-brand-neon hover:bg-brand-neon/20 border-l-4 border-brand-neon rounded-none -ml-6 pl-10" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "glow-green text-brand-neon")} />
                  <span className="font-medium text-sm">{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-6 py-8">
        <div className="glass-card rounded-xl p-4 border-brand-muted">
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-neon">
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              System Status
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse glow-green" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>CPU Load</span>
                <span>12%</span>
              </div>
              <div className="h-1 bg-brand-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand-neon transition-all duration-500" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

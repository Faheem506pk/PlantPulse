import React, { useContext } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { UserContext } from './UserContext';

const Topbar = () => {
  const { userDetails } = useContext(UserContext);

  return (
    <header className="h-20 border-b border-brand-muted bg-brand-deep/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between ml-64">
      <div className="flex items-center flex-1 max-w-md relative group">
        <Search className="absolute left-4 w-4 h-4 text-zinc-500 group-focus-within:text-brand-neon transition-colors" />
        <input 
          type="text" 
          placeholder="Search devices or metrics..." 
          className="w-full bg-brand-surface border border-brand-muted rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-neon transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-400 hover:text-brand-neon transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-neon rounded-full border-2 border-brand-deep glow-green" />
        </button>

        <div className="h-8 w-px bg-brand-muted" />

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-white group-hover:text-brand-neon transition-colors tracking-tight leading-none text-right">
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
            <p className="text-[10px] font-bold text-brand-neon uppercase tracking-widest mt-1 text-right">
              {userDetails?.city || 'System Operator'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-brand-muted p-0.5 group-hover:border-brand-neon transition-colors overflow-hidden">
            <div className="w-full h-full bg-brand-surface rounded-full flex items-center justify-center overflow-hidden">
              {userDetails?.photo ? (
                <img src={userDetails.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-zinc-500 group-hover:text-brand-neon" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

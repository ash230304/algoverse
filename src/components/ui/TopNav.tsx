"use client";

import { useAlgorithmStore, AppTab } from '@/store/useAlgorithmStore';
import { Sparkles, BarChart2, Network, Waypoints, Box, BookOpen } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner classnames
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  { id: 'sorting', label: 'Sorting Lab', icon: <BarChart2 size={18} /> },
  { id: 'graph', label: 'Graph Lab', icon: <Network size={18} /> },
  { id: 'pathfinding', label: 'Pathfinding', icon: <Waypoints size={18} /> },
  { id: 'datastructures', label: 'Data Structures', icon: <Box size={18} /> },
  { id: 'theory', label: 'DAA Theory', icon: <BookOpen size={18} /> },
];

export function TopNav() {
  const mounted = useMounted();
  const { activeTab, setActiveTab } = useAlgorithmStore();

  if (!mounted) {
    return <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-t-0 border-l-0 border-r-0 rounded-none z-50 flex items-center justify-between px-6" />;
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-t-0 border-l-0 border-r-0 rounded-none z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Sparkles className="text-blue-500" size={24} />
        <h1 className="text-xl font-bold tracking-tight text-white mr-8">
          Algo<span className="text-gradient">Verse</span>
        </h1>
      </div>
      
      <nav className="flex space-x-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-white/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center">
        {/* Placeholder for future auth or settings */}
        <button className="text-sm text-slate-400 hover:text-white transition-colors">v1.0.0</button>
      </div>
    </header>
  );
}

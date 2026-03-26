import { User, Files, Search, GitBranch, Play, Blocks, Layers } from 'lucide-react';
import { SidebarView } from '../App';

interface ActivityBarProps {
  activeView: SidebarView;
  onActiveViewChange: (view: SidebarView) => void;
}

export function ActivityBar({ activeView, onActiveViewChange }: ActivityBarProps) {
  return (
    <div className="w-12 flex flex-col items-center py-4 gap-6 border-r border-white/5 bg-[#111116] shrink-0">
      <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl cursor-pointer hover:bg-purple-500/30 transition-colors">
        <User size={20} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col gap-6 text-zinc-500 mt-2">
        <Files 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'explorer' ? 'text-zinc-300' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('explorer')}
        />
        <Search 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'search' ? 'text-zinc-300' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('search')}
        />
        <GitBranch 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'git' ? 'text-zinc-300' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('git')}
        />
        <Play 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'debug' ? 'text-zinc-300' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('debug')}
        />
        <Blocks 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'extensions' ? 'text-zinc-300' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('extensions')}
        />
        <Layers 
          size={22} 
          className={`cursor-pointer transition-colors ${activeView === 'openspec' ? 'text-purple-400' : 'hover:text-zinc-300'}`} 
          strokeWidth={1.5} 
          onClick={() => onActiveViewChange('openspec')}
        />
      </div>
    </div>
  );
}

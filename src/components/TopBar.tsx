import { Search, PanelLeft, PanelRight, PanelBottom } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#111116] shrink-0">
      {/* Mac Controls */}
      <div className="hidden md:flex items-center gap-2 w-48">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-md px-3 py-1 w-full max-w-[400px] text-sm text-zinc-400 shadow-inner">
          <Search size={14} className="text-zinc-500" />
          <span className="truncate">kiro-app</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="hidden md:flex items-center gap-4 w-48 justify-end text-zinc-500">
        <PanelLeft size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
        <PanelBottom size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
        <PanelRight size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, FilePlus, Terminal, Bot, FileText, Zap, FolderOpen, LayoutPanelLeft } from 'lucide-react';

const COMMANDS = [
  { id: '1', title: 'Open Settings', icon: Settings },
  { id: '2', title: 'New File', icon: FilePlus },
  { id: '3', title: 'Open Folder...', icon: FolderOpen },
  { id: '4', title: 'Run Build Task', icon: Zap },
  { id: '5', title: 'Toggle AI Autopilot', icon: Bot },
  { id: '6', title: 'Toggle Sidebar', icon: LayoutPanelLeft },
  { id: '7', title: 'Open Terminal', icon: Terminal },
  { id: '8', title: 'Format Document', icon: FileText },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut (Ctrl+Shift+P or Cmd+Shift+P)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Focus input when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        // Mock execution
        console.log('Executed:', filteredCommands[selectedIndex].title);
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm" 
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-[#1a1a21] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-white/5">
          <Search size={18} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search... (e.g., 'settings')"
            className="w-full bg-transparent text-zinc-200 px-3 py-4 outline-none text-sm placeholder:text-zinc-500 font-sans"
          />
          <div className="text-[10px] text-zinc-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">ESC</div>
        </div>
        
        {filteredCommands.length > 0 ? (
          <div className="max-h-[320px] overflow-y-auto p-2 hide-scrollbar">
            {filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isActive = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors font-sans ${
                    isActive 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    console.log('Executed:', cmd.title);
                    setIsOpen(false);
                  }}
                >
                  <Icon size={16} className={isActive ? 'text-purple-400' : 'text-zinc-500'} />
                  {cmd.title}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-zinc-500 font-sans">
            No commands found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

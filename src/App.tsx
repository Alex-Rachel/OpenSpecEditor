import { useState } from 'react';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { CommandPalette } from './components/CommandPalette';
import { Folder, Code, MessageSquare } from 'lucide-react';

export type SidebarView = 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'openspec';
export type ActiveFile = { id: string; name: string; lineNum?: number; path?: string } | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<'sidebar' | 'editor' | 'ai'>('editor');
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('explorer');
  const [activeFile, setActiveFile] = useState<ActiveFile>({ id: 'change-email-tsk', name: 'tasks.md', path: 'openspec/changes/email-opt-in/tasks.md' });

  const handleFileSelect = (file: ActiveFile) => {
    setActiveFile(file);
    if (window.innerWidth < 768) {
      setActiveTab('editor'); // Switch to editor on mobile when a file is selected
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#0d0d12] text-zinc-300 font-sans overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="hidden md:flex h-full">
          <ActivityBar activeView={activeSidebarView} onActiveViewChange={setActiveSidebarView} />
        </div>
        
        <div className={`
          absolute inset-0 md:relative md:inset-auto
          transition-all duration-300 ease-out origin-bottom
          ${activeTab === 'sidebar' ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}
          md:opacity-100 md:z-auto md:scale-100 md:pointer-events-auto
          flex h-full w-full md:w-auto shrink-0
        `}>
          <Sidebar activeView={activeSidebarView} activeFile={activeFile} onFileSelect={handleFileSelect} />
        </div>
        
        <div className={`
          absolute inset-0 md:relative md:inset-auto
          transition-all duration-300 ease-out origin-bottom
          ${activeTab === 'editor' ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}
          md:opacity-100 md:z-auto md:scale-100 md:pointer-events-auto
          flex h-full w-full md:flex-1 min-w-0
        `}>
          <Editor activeFile={activeFile} />
        </div>
        
        <div className={`
          absolute inset-0 md:relative md:inset-auto
          transition-all duration-300 ease-out origin-bottom
          ${activeTab === 'ai' ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}
          md:opacity-100 md:z-auto md:scale-100 md:pointer-events-auto
          flex h-full w-full md:w-auto shrink-0
        `}>
          <AIPanel />
        </div>
        
        {/* Floating Avatar / Token Counter */}
        <div className="hidden md:flex absolute bottom-4 right-4 w-8 h-8 rounded-full bg-purple-600 items-center justify-center text-xs text-white shadow-lg z-50 cursor-pointer hover:bg-purple-500 transition-colors font-medium">
          00
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around h-[calc(60px+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[#111116] border-t border-white/5 shrink-0">
        <button 
          onClick={() => setActiveTab('sidebar')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'sidebar' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'}`}
        >
          <Folder size={20} />
          <span className="text-[10px] font-medium">Files</span>
        </button>
        <button 
          onClick={() => setActiveTab('editor')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'editor' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'}`}
        >
          <Code size={20} />
          <span className="text-[10px] font-medium">Editor</span>
        </button>
        <button 
          onClick={() => setActiveTab('ai')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'ai' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-medium">AI Chat</span>
        </button>
      </div>

      {/* Global Overlays */}
      <CommandPalette />
    </div>
  );
}

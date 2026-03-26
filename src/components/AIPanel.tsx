import { Plus, List, History, X, FileText, Eye, Loader2, ArrowUp, Hash, AtSign, ChevronDown, RefreshCcw, Pause } from 'lucide-react';

export function AIPanel() {
  return (
    <div className="w-full md:w-[420px] flex flex-col bg-[#1a1a21] border-l border-white/5 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between h-10 px-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md text-sm text-zinc-300 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          New Session
          <X size={14} className="text-zinc-500 hover:text-zinc-300 ml-1 transition-colors" />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <Plus size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <List size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <History size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <X size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 hide-scrollbar">
        {/* Context Area */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3 font-medium">
            <FileText size={16} className="text-green-400" />
            Including Steering Documents
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs text-zinc-400 font-mono cursor-pointer hover:bg-white/20 transition-colors">product.md</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs text-zinc-400 font-mono cursor-pointer hover:bg-white/20 transition-colors">structure.md</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs text-zinc-400 font-mono cursor-pointer hover:bg-white/20 transition-colors">tech.md</span>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex flex-col gap-5 text-[13px] text-zinc-300">
          <p className="leading-relaxed">
            I'll implement task 1 to set up the backend API foundation. Let me start by examining the current backend structure.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-3 gap-2 hover:bg-white/10 cursor-pointer transition-colors">
              <Eye size={16} className="text-green-400 shrink-0" />
              <span className="text-zinc-400">Read file(s)</span>
              <span className="text-zinc-300 bg-white/10 px-2 py-0.5 rounded text-xs font-mono ml-auto">index.ts</span>
            </div>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-3 gap-2 hover:bg-white/10 cursor-pointer transition-colors">
              <Eye size={16} className="text-green-400 shrink-0" />
              <span className="text-zinc-400">Read file(s)</span>
              <span className="text-zinc-300 bg-white/10 px-2 py-0.5 rounded text-xs font-mono ml-auto">package.json</span>
            </div>
          </div>

          <p className="leading-relaxed">
            Now I'll update the task status and implement the backend API foundation with the required data types, in-memory storage, and CORS middleware.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start gap-2 text-zinc-300 text-sm font-medium">
              <FileText size={16} className="text-green-400 shrink-0 mt-0.5" />
              <span className="leading-tight italic">Task: 1. Set up backend API foundation</span>
            </div>
            <div className="text-zinc-400 text-xs pl-6 flex items-center gap-1">
              from <span className="text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">index.ts</span>
            </div>
            <div className="text-zinc-400 text-xs pl-6 italic">
              Status: In Progress
            </div>
          </div>

          {/* Editing Block */}
          <div className="bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                <Loader2 size={14} className="animate-spin" />
                <span>Editing</span>
              </div>
              <RefreshCcw size={14} className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3.5 bg-black/20">
              <span className="text-xs text-zinc-400">Working..</span>
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs text-zinc-300 transition-colors">Cancel</button>
                <button className="px-3.5 py-1.5 bg-zinc-200 hover:bg-white text-black rounded-md text-xs flex items-center gap-1.5 transition-colors font-medium">
                  <Eye size={14} />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 shrink-0 bg-[#1a1a21] border-t border-white/5">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3 focus-within:border-purple-500/50 transition-colors shadow-inner">
          <div className="flex items-start gap-2">
            <textarea 
              placeholder="Ask a question or describe a task" 
              className="w-full bg-transparent text-[13px] text-zinc-300 placeholder:text-zinc-500 resize-none outline-none min-h-[40px] pt-1"
              rows={2}
            />
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
              <ArrowUp size={16} className="text-zinc-300" />
            </button>
          </div>
          <div className="flex items-center justify-between text-zinc-500">
            <div className="flex items-center gap-3">
              <Hash size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
              <AtSign size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer transition-colors font-medium">
                Auto <ChevronDown size={12} />
              </div>
              <div className="flex items-center gap-1.5 font-medium text-zinc-400">
                Autopilot
                <button className="flex items-center justify-center w-4 h-4 rounded-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                  <Pause size={10} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

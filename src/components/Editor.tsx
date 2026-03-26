import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, FileText, Zap, Loader2, MoreHorizontal, X, CheckCircle2 } from 'lucide-react';
import { ActiveFile } from '../App';
import { MOCK_FILE_CONTENT } from '../lib/mockData';

const TaskInProgress = () => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium mb-1 cursor-pointer hover:bg-blue-500/20 transition-colors select-none font-sans tracking-wide uppercase shadow-sm">
    <Loader2 size={12} className="animate-spin" />
    Task in progress
  </div>
);

const StartTask = () => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-medium mb-1 cursor-pointer hover:bg-white/10 hover:text-zinc-200 transition-colors select-none font-sans tracking-wide uppercase shadow-sm">
    <Zap size={12} className="text-purple-400 fill-purple-400/20" />
    Start task
  </div>
);

const TaskCompleted = () => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-medium mb-1 select-none font-sans tracking-wide uppercase shadow-sm">
    <CheckCircle2 size={12} />
    Completed
  </div>
);

export function Editor({ activeFile }: { activeFile: ActiveFile }) {
  const [lines, setLines] = useState([
    { id: 1, num: 1, content: <><span className="text-purple-400">#</span> Implementation Plan</> },
    { id: 2, num: 2, content: '' },
    { id: 3, num: 3, widget: <TaskInProgress />, isTask: true, checked: false, expanded: false, text: '1. Set up backend API foundation', details: { description: 'Establish the core backend infrastructure using Hono, including routing, middleware, and in-memory data structures.', subtasks: ['Create subscription data types', 'Set up in-memory storage', 'Configure CORS middleware'], requirements: ['Req 2.1', 'Req 2.2', 'Req 2.3'] } },
    { id: 4, num: 4, content: <span className="text-zinc-400">- Create subscription data types and interfaces in the Hono server</span> },
    { id: 5, num: 5, content: <span className="text-zinc-400">- Set up in-memory storage structure for subscribers</span> },
    { id: 6, num: 6, content: <span className="text-zinc-400">- Configure CORS middleware for frontend-backend communication</span> },
    { id: 7, num: 7, content: <span className="text-zinc-500 italic">- _Requirements: 2.1, 2.2, 2.3_</span> },
    { id: 8, num: 8, content: '' },
    { id: 9, num: 9, widget: <StartTask />, isTask: true, checked: false, expanded: false, text: '2. Implement backend subscription endpoint', details: { description: 'Build the main API endpoints for handling subscription requests from the frontend.', subtasks: ['Create POST /api/subscribe', 'Implement validation logic', 'Add error handling'], requirements: ['Req 2.1', 'Req 2.2'] } },
    { id: 10, num: 10, content: '' },
    { id: 11, num: 11, widget: <StartTask />, isTask: true, checked: false, expanded: false, text: '2.1 Create POST /api/subscribe endpoint with request validation', details: { description: 'Validate incoming POST requests to ensure email format is correct before processing.', subtasks: ['Regex email validation', 'Body parsing', 'Return 400 on invalid'], requirements: ['Req 2.1', 'Req 2.2'] } },
    { id: 12, num: 12, content: <span className="text-zinc-400">- Implement email format validation</span> },
    { id: 13, num: 13, content: <span className="text-zinc-400">- Add request body parsing and validation</span> },
    { id: 14, num: 14, content: <span className="text-zinc-500 italic">- _Requirements: 2.1, 2.2_</span> },
    { id: 15, num: 15, content: '' },
    { id: 16, num: 16, widget: <StartTask />, isTask: true, checked: false, expanded: false, text: '2.2 Implement subscriber storage and duplicate prevention', dimmed: true, details: { description: 'Store validated emails and prevent duplicate entries in the system.', subtasks: ['Storage functions', 'Duplicate detection', 'Return 409 on duplicate'], requirements: ['Req 2.2'] } },
    { id: 17, num: 17, content: <span className="text-zinc-600">- Create subscriber storage functions</span> },
    { id: 18, num: 18, content: <span className="text-zinc-600">- Add duplicate email detection logic</span> },
  ]);

  const toggleTask = (id: number) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, checked: !line.checked } : line
    ));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, expanded: !line.expanded } : line
    ));
  };

  useEffect(() => {
    if (activeFile?.lineNum) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        const element = document.getElementById(`line-${activeFile.lineNum}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-purple-500/20');
          setTimeout(() => {
            element.classList.remove('bg-purple-500/20');
          }, 2000);
        }
      }, 50);
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeFile]);

  if (!activeFile) {
    return (
      <div className="w-full md:flex-1 flex flex-col items-center justify-center bg-[#111116] min-w-0 text-zinc-500">
        <FileText size={48} className="mb-4 opacity-20" />
        <p>Select a file to view its contents</p>
      </div>
    );
  }

  const isSpecialTasksFile = activeFile.id === 'tsk';
  const fileContent = MOCK_FILE_CONTENT[activeFile.id] || ['File content not available.'];

  return (
    <div className="w-full md:flex-1 flex flex-col bg-[#111116] min-w-0">
      {/* Tabs */}
      <div className="flex items-center h-10 border-b border-white/5 px-2 shrink-0 overflow-x-auto hide-scrollbar bg-[#111116]">
        <div className="px-4 py-2 text-sm text-zinc-300 bg-[#1a1a21] border-t-2 border-t-purple-500 flex items-center gap-2 cursor-pointer rounded-t-md">
          {activeFile.name}
          <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
        </div>
        <div className="ml-auto flex items-center gap-3 text-zinc-500 px-2">
            <div className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center text-[10px] hover:bg-white/5 cursor-pointer transition-colors">1</div>
            <MoreHorizontal size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center px-4 h-8 text-xs text-zinc-500 gap-1.5 shrink-0 bg-[#111116] overflow-x-auto hide-scrollbar whitespace-nowrap">
        <span className="hover:text-zinc-300 cursor-pointer transition-colors">kiro-app</span>
        <ChevronRight size={12} />
        <span className="text-zinc-400">{activeFile.name}</span>
      </div>

      {/* Spec Header (Only for tasks.md) */}
      {isSpecialTasksFile && (
        <div className="flex flex-col md:flex-row md:items-center px-4 md:px-6 py-3 gap-3 md:gap-6 border-b border-white/5 shrink-0 bg-[#111116]">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <FileText size={16} className="text-zinc-400" />
            Spec: email-opt-in
          </div>
          <div className="flex items-center gap-4 text-xs font-medium overflow-x-auto hide-scrollbar whitespace-nowrap pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">1</span>
              Requirements
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">2</span>
              Design
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 bg-white/5 px-2.5 py-1.5 rounded-md cursor-pointer">
              <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">3</span>
              Task List
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed bg-[#111116]">
        <div className="flex flex-col max-w-4xl">
          {isSpecialTasksFile ? (
            lines.map((line) => (
              <div key={line.id} className="flex flex-col">
                {line.isTask && line.checked ? (
                  <div className="flex">
                    <div className="w-12 shrink-0"></div>
                    <div className="pt-4 pb-1"><TaskCompleted /></div>
                  </div>
                ) : line.widget ? (
                  <div className="flex">
                    <div className="w-12 shrink-0"></div>
                    <div className="pt-4 pb-1">{line.widget}</div>
                  </div>
                ) : null}
                <div id={`line-${line.num}`} className="flex items-start min-h-[24px] hover:bg-white/[0.02] transition-colors duration-500">
                  <div className="w-12 shrink-0 text-zinc-600 text-right pr-4 select-none pt-0.5">
                    {line.num}
                  </div>
                  <div className="flex-1 text-zinc-300 pt-0.5">
                    {line.isTask ? (
                      <div className="flex flex-col">
                        <div className="flex items-start gap-2">
                          <span 
                            className="cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors select-none mt-0.5"
                            onClick={() => toggleTask(line.id)}
                          >
                            {line.checked ? '[x]' : '[ ]'}
                          </span>
                          <span 
                            className={`cursor-pointer flex items-center gap-1.5 ${line.checked ? 'line-through text-zinc-500' : (line.dimmed ? 'text-zinc-500' : 'text-zinc-300')} hover:text-zinc-100 transition-all`}
                            onClick={() => toggleExpand(line.id)}
                          >
                            {line.text}
                            {line.expanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
                          </span>
                        </div>
                        
                        {/* Collapsible Panel */}
                        {line.expanded && line.details && (
                          <div className="mt-3 mb-4 p-4 bg-white/5 border border-white/10 rounded-lg text-sm font-sans shadow-lg">
                            <h4 className="font-medium text-zinc-200 mb-2">Task Details</h4>
                            <p className="text-zinc-400 mb-4 text-[13px] leading-relaxed">{line.details.description}</p>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h5 className="text-[11px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Subtasks</h5>
                                <ul className="flex flex-col gap-2">
                                  {line.details.subtasks.map((st: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-zinc-300 text-[13px]">
                                      <div className="w-1 h-1 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                                      {st}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-[11px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Requirements</h5>
                                <div className="flex flex-wrap gap-2">
                                  {line.details.requirements.map((req: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-[11px] border border-purple-500/20 font-medium">
                                      {req}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      line.content
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            fileContent.map((line, index) => (
              <div key={index} id={`line-${index + 1}`} className="flex items-start min-h-[24px] hover:bg-white/[0.02] transition-colors duration-500">
                <div className="w-12 shrink-0 text-zinc-600 text-right pr-4 select-none pt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 text-zinc-300 pt-0.5 whitespace-pre-wrap">
                  {line}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

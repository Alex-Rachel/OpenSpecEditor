import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileJson, FileCode, MoreHorizontal, Search, PlusCircle, Database, GitMerge, Archive, Settings, Layers, Activity, CheckCircle2, GitBranch, GitCommit, X } from 'lucide-react';
import { SidebarView, ActiveFile } from '../App';
import { FileNode, INITIAL_FILE_TREE, MOCK_FILE_CONTENT } from '../lib/mockData';

const getFileIcon = (name: string, nodeType?: string) => {
  if (nodeType === 'spec') return <Database size={14} className="text-blue-400" />;
  if (nodeType === 'change') return <GitMerge size={14} className="text-orange-400" />;
  if (nodeType === 'archive') return <Archive size={14} className="text-zinc-500" />;
  if (nodeType === 'config') return <Settings size={14} className="text-zinc-400" />;

  if (name.endsWith('.md')) return <FileText size={14} className="text-blue-400" />;
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return <FileJson size={14} className="text-yellow-400" />;
  return <FileText size={14} className="text-zinc-400" />;
};

const getNodeColor = (nodeType?: string) => {
  if (nodeType === 'spec') return 'text-blue-400';
  if (nodeType === 'change') return 'text-orange-400';
  if (nodeType === 'archive') return 'text-zinc-500';
  return 'text-zinc-400';
};

const filterTree = (nodes: FileNode[], query: string): FileNode[] => {
  if (!query) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes.reduce<FileNode[]>((acc, node) => {
    const isMatch = node.name.toLowerCase().includes(lowerQuery);

    if (node.type === 'folder' && node.children) {
      const filteredChildren = filterTree(node.children, query);
      if (isMatch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
      }
    } else if (isMatch) {
      acc.push(node);
    }

    return acc;
  }, []);
};

function TreeNode({ 
  node, 
  level = 0, 
  forceOpen = false,
  activeFileId,
  onFileSelect
}: { 
  key?: string; 
  node: FileNode; 
  level?: number; 
  forceOpen?: boolean;
  activeFileId?: string;
  onFileSelect: (file: ActiveFile) => void;
}) {
  const [isOpen, setIsOpen] = useState(node.isOpen);

  const effectivelyOpen = forceOpen || isOpen;
  const isActive = node.type === 'file' && node.id === activeFileId;
  const nodeColor = getNodeColor(node.nodeType);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect({ id: node.id, name: node.name, path: node.path });
    }
  };

  return (
    <div className="flex flex-col font-sans select-none">
      <div
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors text-[13px] ${
          isActive
            ? 'bg-purple-500/20 text-purple-300'
            : 'hover:bg-white/5 hover:text-zinc-300'
        } ${!isActive ? nodeColor : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <div className="flex items-center gap-1">
            {effectivelyOpen ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
            {getFileIcon(node.name, node.nodeType)}
          </div>
        ) : (
          <div className="flex items-center gap-1 ml-4">
            {getFileIcon(node.name, node.nodeType)}
          </div>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      
      {node.type === 'folder' && effectivelyOpen && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              forceOpen={forceOpen} 
              activeFileId={activeFileId}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SearchResult = {
  fileId: string;
  fileName: string;
  matches: { lineNum: number; text: string; matchIndex: number; matchLength: number }[];
};

const performSearch = (query: string): SearchResult[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  const findFileName = (nodes: FileNode[], id: string): string | null => {
    for (const node of nodes) {
      if (node.id === id) return node.name;
      if (node.children) {
        const found = findFileName(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  Object.entries(MOCK_FILE_CONTENT).forEach(([fileId, lines]) => {
    const matches: SearchResult['matches'] = [];
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      const matchIndex = lowerLine.indexOf(lowerQuery);
      if (matchIndex !== -1) {
        matches.push({
          lineNum: index + 1,
          text: line,
          matchIndex,
          matchLength: query.length
        });
      }
    });

    if (matches.length > 0) {
      const fileName = findFileName(INITIAL_FILE_TREE, fileId) || 'Unknown File';
      results.push({ fileId, fileName, matches });
    }
  });

  return results;
};

function OpenSpecView({ 
  onFileSelect,
  isInitialized,
  setIsInitialized
}: { 
  onFileSelect: (file: ActiveFile) => void;
  isInitialized: boolean;
  setIsInitialized: (val: boolean) => void;
}) {
  const [sectionsOpen, setSectionsOpen] = useState({
    activeChanges: true,
    directory: true,
    activity: true
  });
  const [isNewChangeModalOpen, setIsNewChangeModalOpen] = useState(false);
  const [isNewDomainModalOpen, setIsNewDomainModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate progress for email-opt-in dynamically
  const tasksContent = MOCK_FILE_CONTENT['change-email-tsk'] || [];
  const totalTasks = tasksContent.filter(line => line.trim().match(/^- \[[ x]\]/i)).length;
  const completedTasks = tasksContent.filter(line => line.trim().match(/^- \[x\]/i)).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Extract directory nodes
  const openSpecNode = INITIAL_FILE_TREE.find(n => n.name === 'openspec');
  const specsNode = openSpecNode?.children?.find(n => n.name === 'specs');
  const changesNode = openSpecNode?.children?.find(n => n.name === 'changes');
  const archiveNode = openSpecNode?.children?.find(n => n.name === 'archive');

  const specsCount = specsNode?.children?.length || 0;
  const changesCount = changesNode?.children?.length || 0;
  const archiveCount = archiveNode?.children?.length || 0;

  if (!isInitialized) {
    return (
      <div className="flex flex-col h-full bg-[#111116] text-zinc-300 font-sans">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-purple-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">OpenSpec Dashboard</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <Database size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-sm font-medium text-zinc-300 mb-2">OpenSpec Not Found</h3>
          <p className="text-xs text-zinc-500 mb-6">
            Initialize an OpenSpec directory to start managing your specifications and changes.
          </p>
          <button 
            onClick={() => setIsInitialized(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-md transition-colors"
          >
            <PlusCircle size={14} />
            Initialize OpenSpec
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111116] text-zinc-300 font-sans">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-purple-400" />
          <span className="text-xs font-semibold tracking-wider uppercase">OpenSpec Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Settings">
            <Settings size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-semibold text-blue-400">{specsCount}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">Domains</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-semibold text-orange-400">{changesCount}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">Active</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-semibold text-purple-400">{progress}%</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">Progress</span>
          </div>
        </div>

        {/* Active Changes */}
        <section>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer group"
            onClick={() => toggleSection('activeChanges')}
          >
            <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2 group-hover:text-zinc-400 transition-colors">
              <ChevronDown size={14} className={`transition-transform duration-200 ${sectionsOpen.activeChanges ? '' : '-rotate-90'}`} />
              <Activity size={14} /> Active Changes
            </h3>
            <button 
              className="text-zinc-500 hover:text-purple-400 transition-colors" 
              title="New Change" 
              onClick={(e) => { e.stopPropagation(); setIsNewChangeModalOpen(true); }}
            >
              <PlusCircle size={14} />
            </button>
          </div>
          
          {sectionsOpen.activeChanges && (
            <div 
              className="bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.04] transition-colors cursor-pointer group"
              onClick={() => onFileSelect({ id: 'change-email-tsk', name: 'tasks.md', path: 'openspec/changes/email-opt-in/tasks.md' })}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-purple-300 group-hover:text-purple-200 transition-colors">email-opt-in</h4>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/20">Implementing</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4 line-clamp-2">Capture user interest before official launch with an email waitlist.</p>
              
              {/* Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Tasks Progress</span>
                  <span>{completedTasks}/{totalTasks} ({progress}%)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Pipeline Mini */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                 <div className="flex gap-1.5 items-center">
                   <div className="w-2 h-2 rounded-full bg-green-500" title="Proposal (Done)" />
                   <div className="w-3 h-[1px] bg-green-500/50" />
                   <div className="w-2 h-2 rounded-full bg-green-500" title="Specs (Done)" />
                   <div className="w-3 h-[1px] bg-green-500/50" />
                   <div className="w-2 h-2 rounded-full bg-green-500" title="Design (Done)" />
                   <div className="w-3 h-[1px] bg-purple-500/50" />
                   <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse ring-2 ring-purple-500/30" title="Tasks (In Progress)" />
                 </div>
                 <span 
                   className="text-[10px] text-zinc-500 group-hover:text-purple-400 transition-colors"
                   onClick={(e) => { e.stopPropagation(); setIsDetailsModalOpen(true); }}
                 >
                   View Details →
                 </span>
              </div>
            </div>
          )}
        </section>

        {/* Directory Structure (Git-like) */}
        <section>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer group"
            onClick={() => toggleSection('directory')}
          >
            <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2 group-hover:text-zinc-400 transition-colors">
              <ChevronDown size={14} className={`transition-transform duration-200 ${sectionsOpen.directory ? '' : '-rotate-90'}`} />
              <GitBranch size={14} /> Directory Structure
            </h3>
          </div>
                   {sectionsOpen.directory && (
            <div className="space-y-2 bg-white/[0.01] border border-white/5 rounded-lg p-2">
              {/* Specs */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-zinc-300 group">
                  <div className="flex items-center gap-2">
                    <Database size={14} className="text-blue-400" />
                    <span className="text-xs font-medium">specs/</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">{specsCount} domains</span>
                    <button 
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-blue-400 transition-all" 
                      title="New Domain" 
                      onClick={(e) => { e.stopPropagation(); setIsNewDomainModalOpen(true); }}
                    >
                      <PlusCircle size={12} />
                    </button>
                  </div>
                </div>
                {specsCount > 0 ? (
                  <div className="ml-4 pl-3 border-l border-white/10 flex flex-col gap-1.5 py-1.5">
                    {specsNode?.children?.map(child => (
                      <div 
                        key={child.id} 
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer group/item"
                        onClick={() => onFileSelect({ id: `${child.id}-md`, name: 'spec.md', path: `openspec/specs/${child.name}/spec.md` })}
                      >
                        <GitCommit size={12} className="text-blue-500/50 group-hover/item:text-blue-400" />
                        <span>{child.name}</span>
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded border border-white/5">Stable</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-4 pl-3 border-l border-white/10 py-1 text-[10px] text-zinc-600 italic">Empty</div>
                )}
              </div>

              {/* Changes */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-zinc-300 group">
                  <div className="flex items-center gap-2">
                    <GitMerge size={14} className="text-orange-400" />
                    <span className="text-xs font-medium">changes/</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">{changesCount} active</span>
                    <button 
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-orange-400 transition-all" 
                      title="New Change" 
                      onClick={(e) => { e.stopPropagation(); setIsNewChangeModalOpen(true); }}
                    >
                      <PlusCircle size={12} />
                    </button>
                  </div>
                </div>
                {changesCount > 0 ? (
                  <div className="ml-4 pl-3 border-l border-white/10 flex flex-col gap-1.5 py-1.5">
                    {changesNode?.children?.map(child => (
                      <div 
                        key={child.id} 
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer group/item"
                        onClick={() => onFileSelect({ id: `${child.id}-tsk`, name: 'tasks.md', path: `openspec/changes/${child.name}/tasks.md` })}
                      >
                        <GitCommit size={12} className="text-orange-500/50 group-hover/item:text-orange-400" />
                        <span>{child.name}</span>
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Implementing</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-4 pl-3 border-l border-white/10 py-1 text-[10px] text-zinc-600 italic">No active changes</div>
                )}
              </div>

              {/* Archive */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-2 py-1.5 hover:bg-white/5 rounded-md cursor-pointer text-zinc-300 group">
                  <div className="flex items-center gap-2">
                    <Archive size={14} className="text-zinc-500" />
                    <span className="text-xs font-medium">archive/</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">{archiveCount} archived</span>
                </div>
                {archiveCount > 0 ? (
                  <div className="ml-4 pl-3 border-l border-white/10 flex flex-col gap-1.5 py-1.5">
                    {archiveNode?.children?.map(child => (
                      <div 
                        key={child.id} 
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer group/item"
                        onClick={() => onFileSelect({ id: `${child.id}-prop`, name: 'proposal.md', path: `openspec/archive/${child.name}/proposal.md` })}
                      >
                        <GitCommit size={12} className="text-zinc-600 group-hover/item:text-zinc-400" />
                        <span>{child.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-4 pl-3 border-l border-white/10 py-1 text-[10px] text-zinc-600 italic">Empty</div>
                )}
              </div>
            </div>
          )}  </section>

        {/* Recent Activity */}
        <section>
          <h3 className="text-[11px] font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <GitMerge size={14} /> Recent Activity
          </h3>
          <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-lg p-3">
            <div className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Updated <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => onFileSelect({ id: 'change-email-tsk', name: 'tasks.md', path: 'openspec/changes/email-opt-in/tasks.md' })}>tasks.md</span> in email-opt-in
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Merged <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => onFileSelect({ id: 'archive-old-prop', name: 'proposal.md', path: 'openspec/archive/v1-migration/proposal.md' })}>v1-migration</span> to specs
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Yesterday</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* New Change Modal */}
      {isNewChangeModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <GitMerge size={14} className="text-orange-400" />
                New Change
              </h3>
              <button onClick={() => setIsNewChangeModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Change Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. feature-login" 
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea 
                  placeholder="Brief description of the change..." 
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2 bg-white/[0.02]">
              <button 
                onClick={() => setIsNewChangeModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsNewChangeModalOpen(false)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-md transition-colors"
              >
                Create Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Domain Modal */}
      {isNewDomainModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Database size={14} className="text-blue-400" />
                New Domain
              </h3>
              <button onClick={() => setIsNewDomainModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Domain Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. user-auth" 
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea 
                  placeholder="Brief description of the domain..." 
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2 bg-white/[0.02]">
              <button 
                onClick={() => setIsNewDomainModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsNewDomainModalOpen(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors"
              >
                Create Domain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e24] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Activity size={14} className="text-purple-400" />
                Change Details: email-opt-in
              </h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-6">
              {/* Pipeline Full */}
              <div>
                <h4 className="text-xs font-medium text-zinc-400 mb-3">Pipeline Status</h4>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-zinc-300">Proposal</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-green-500/30 mx-2" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-zinc-300">Specs</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-green-500/30 mx-2" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-zinc-300">Design</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-purple-500/30 mx-2" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/50 ring-2 ring-purple-500/20 animate-pulse">
                      <Activity size={12} />
                    </div>
                    <span className="text-purple-300 font-medium">Tasks</span>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-zinc-400">Tasks ({completedTasks}/{totalTasks})</h4>
                  <span className="text-[10px] text-zinc-500">{progress}% Complete</span>
                </div>
                <div className="space-y-2">
                  {tasksContent.filter(line => line.trim().match(/^- \[[ x]\]/i)).map((task, idx) => {
                    const isCompleted = task.trim().toLowerCase().startsWith('- [x]');
                    const taskText = task.replace(/^- \[[ x]\]\s*/i, '');
                    return (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className={`mt-0.5 shrink-0 ${isCompleted ? 'text-green-400' : 'text-zinc-600'}`}>
                          {isCompleted ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />}
                        </div>
                        <span className={isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-300'}>
                          {taskText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ 
  activeView, 
  activeFile, 
  onFileSelect 
}: { 
  activeView: SidebarView;
  activeFile: ActiveFile;
  onFileSelect: (file: ActiveFile) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const filteredTree = filterTree(INITIAL_FILE_TREE, searchQuery);
  const searchResults = performSearch(globalSearchQuery);

  const renderContent = () => {
    switch (activeView) {
      case 'openspec':
        return <OpenSpecView onFileSelect={onFileSelect} isInitialized={isInitialized} setIsInitialized={setIsInitialized} />;
      case 'search':
        return (
          <div className="flex flex-col h-full">
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">SEARCH</span>
            </div>
            <div className="p-4 pb-2 shrink-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-colors">
                <Search size={14} className="text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-zinc-300 w-full placeholder:text-zinc-600 font-sans"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-4">
              {!globalSearchQuery ? (
                <div className="text-xs text-zinc-500 text-center mt-4 px-4">
                  Type to search across all files.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-xs text-zinc-500 text-center mt-4 px-4">
                  No results found for "{globalSearchQuery}".
                </div>
              ) : (
                <div className="flex flex-col">
                  {searchResults.map(result => (
                    <div key={result.fileId} className="flex flex-col mb-2">
                      <div 
                        className={`flex items-center gap-1.5 px-4 py-1 text-[13px] cursor-pointer ${
                          activeFile?.id === result.fileId 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'text-zinc-300 bg-white/[0.02] hover:bg-white/5'
                        }`}
                        onClick={() => onFileSelect({ id: result.fileId, name: result.fileName })}
                      >
                        <ChevronDown size={14} className="text-zinc-500" />
                        {getFileIcon(result.fileName)}
                        <span className="font-medium">{result.fileName}</span>
                        <span className="ml-auto text-[10px] text-zinc-500 bg-white/10 px-1.5 rounded-full">{result.matches.length}</span>
                      </div>
                      <div className="flex flex-col">
                        {result.matches.map((match, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-2 px-4 py-1 text-[12px] text-zinc-400 cursor-pointer hover:bg-white/5 hover:text-zinc-300 pl-8"
                            onClick={() => onFileSelect({ id: result.fileId, name: result.fileName, lineNum: match.lineNum })}
                          >
                            <span className="text-zinc-600 shrink-0 w-6 text-right select-none">{match.lineNum}</span>
                            <span className="truncate font-mono text-[11px] mt-0.5">
                              {match.text.substring(0, match.matchIndex)}
                              <span className="bg-purple-500/30 text-purple-200 rounded-sm px-0.5">{match.text.substring(match.matchIndex, match.matchIndex + match.matchLength)}</span>
                              {match.text.substring(match.matchIndex + match.matchLength)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'git':
        return (
          <div className="flex flex-col h-full">
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">SOURCE CONTROL</span>
            </div>
            <div className="p-4 text-xs text-zinc-500 text-center mt-8">
              No pending changes.
            </div>
          </div>
        );
      case 'debug':
        return (
          <div className="flex flex-col h-full">
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">RUN AND DEBUG</span>
            </div>
            <div className="p-4 text-xs text-zinc-500 text-center mt-8">
              To customize Run and Debug, open a folder and create a launch.json file.
            </div>
          </div>
        );
      case 'extensions':
        return (
          <div className="flex flex-col h-full">
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">EXTENSIONS</span>
            </div>
            <div className="p-4 text-xs text-zinc-500 text-center mt-8">
              Marketplace is currently unavailable.
            </div>
          </div>
        );
      case 'explorer':
      default:
        return (
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">EXPLORER</span>
              <MoreHorizontal size={14} className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
            </div>

            {/* Search Input */}
            <div className="px-3 py-2 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-colors">
                <Search size={14} className="text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-zinc-300 w-full placeholder:text-zinc-600 font-sans"
                />
              </div>
            </div>

            {/* Project Root */}
            <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
              <div className="px-4 py-1 flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1">
                <ChevronDown size={14} className="text-zinc-500" />
                KIRO-APP
              </div>
              
              {/* File Tree */}
              <div className="flex flex-col">
                {filteredTree.length > 0 ? (
                  filteredTree.map((node) => (
                    <TreeNode 
                      key={node.id} 
                      node={node} 
                      forceOpen={searchQuery.length > 0} 
                      activeFileId={activeFile?.id}
                      onFileSelect={onFileSelect}
                    />
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-zinc-500 text-center">
                    No files found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full md:w-60 flex flex-col bg-[#111116] border-r border-white/5 shrink-0">
      {renderContent()}
    </div>
  );
}

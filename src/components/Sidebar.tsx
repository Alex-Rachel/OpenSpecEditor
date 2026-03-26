import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileJson, FileCode, MoreHorizontal, Search } from 'lucide-react';
import { SidebarView, ActiveFile } from '../App';
import { FileNode, INITIAL_FILE_TREE, MOCK_FILE_CONTENT } from '../lib/mockData';

const getFileIcon = (name: string) => {
  if (name.endsWith('.md')) return <FileText size={14} className="text-blue-400" />;
  if (name.endsWith('.json')) return <FileJson size={14} className="text-yellow-400" />;
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={14} className="text-blue-500" />;
  return <FileText size={14} className="text-zinc-400" />;
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

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect({ id: node.id, name: node.name });
    }
  };

  return (
    <div className="flex flex-col font-sans select-none">
      <div
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors text-[13px] ${
          isActive
            ? 'bg-purple-500/20 text-purple-300'
            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <div className="flex items-center gap-1">
            {effectivelyOpen ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
            {effectivelyOpen ? <FolderOpen size={14} className="text-zinc-400" /> : <Folder size={14} className="text-zinc-400" />}
          </div>
        ) : (
          <div className="flex items-center gap-1 ml-4">
            {getFileIcon(node.name)}
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
  
  const filteredTree = filterTree(INITIAL_FILE_TREE, searchQuery);
  const searchResults = performSearch(globalSearchQuery);

  const renderContent = () => {
    switch (activeView) {
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

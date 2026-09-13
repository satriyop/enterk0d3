
import React, { useState, useMemo, useEffect } from 'react';
import { GIT_HISTORY } from '../constants';
import { HistoryNode, Project } from '../types';

interface GitGraphProps {
  activeProject: Project;
}

const GitGraph: React.FC<GitGraphProps> = ({ activeProject }) => {
  const [hoveredNode, setHoveredNode] = useState<HistoryNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<HistoryNode | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  // Derive history: Use project specific history, or fallback to global log
  const currentHistory = useMemo(() => {
    return activeProject.history || GIT_HISTORY;
  }, [activeProject]);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 400);
    return () => clearTimeout(timer);
  }, [activeProject]);

  useEffect(() => {
    if (!selectedNode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleNodeClick = (node: HistoryNode) => {
    setSelectedNode(node);
  };

  const handleCopyHash = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const closeModal = () => {
    setSelectedNode(null);
  };

  return (
    <div 
      className="p-6 bg-white border-4 border-black brutal-shadow overflow-x-hidden relative min-h-[700px] flex flex-col hud-corner"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-4 right-4 text-[10px] font-black rotate-90 origin-right tracking-tighter opacity-15 select-none">
        REMOTE_LOG_{activeProject.title}_V4
      </div>
      
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-black border-b-4 border-black pb-1 inline-block italic uppercase">
            GIT_FLOW_SYNC
          </h2>
          <div className="bg-[#E2FF00] text-black border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black uppercase brutal-shadow-sm">
            NODE_{activeProject.title}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase bg-black text-white px-1.5 py-0.5">BRANCH:</span>
          <span className="text-[10px] font-mono font-bold italic opacity-70">origin/main</span>
        </div>
      </div>
      
      <div className={`relative flex-1 transition-opacity duration-200 ${isSyncing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {/* Animated backbone wire */}
        <div className="absolute left-[15px] top-0 bottom-0 w-[4px] bg-black overflow-hidden">
          <div className="w-full h-20 bg-[#E2FF00] absolute animate-wire-pulse"></div>
        </div>
        
        <div className="space-y-10 py-4">
          {currentHistory.map((node) => {
            const isCommit = node.type === 'commit';
            const isMerge = node.type === 'merge';
            const isRelease = node.type === 'release';

            return (
              <div 
                key={node.id} 
                className="relative flex items-center gap-6 group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              >
                {/* Node Container */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8 cursor-pointer">
                  {/* Node Shape */}
                  <div className={`
                    absolute transition-all duration-200
                    ${isCommit ? 'w-4 h-4 border-2 border-black bg-white group-hover:bg-black group-hover:scale-125' : ''}
                    ${isMerge ? 'w-6 h-6 border-2 border-black bg-zinc-200 rotate-45 group-hover:bg-black group-hover:animate-brutal-pulse' : ''}
                    ${isRelease ? 'w-8 h-8 border-4 border-black bg-black text-white brutal-shadow-sm flex items-center justify-center scale-110 group-hover:animate-brutal-glow' : ''}
                  `}>
                    <span className={`font-mono font-black select-none text-[8px] ${isRelease ? 'text-sm' : ''}`}>
                      {isMerge ? 'M' : isRelease ? '!' : ''}
                    </span>
                  </div>
                </div>
                
                {/* Content info */}
                <div className={`
                  border-l-4 border-black pl-3 py-1.5 transition-all group-hover:translate-x-1 cursor-pointer flex-1
                  ${isRelease ? 'bg-black text-white px-3 py-2 brutal-shadow-sm border-l-4 border-[#E2FF00]' : 'bg-white hover:bg-zinc-50'}
                `}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 ${isRelease ? 'bg-[#E2FF00] text-black font-black' : 'bg-black text-white'}`}>
                        {node.date}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-tight ${isRelease ? 'text-base text-[#E2FF00]' : ''}`}>
                        {node.label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleCopyHash(e, node.id)}
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border border-black tactile-btn shrink-0 ${
                        copiedId === node.id
                          ? 'bg-[#E2FF00] text-black'
                          : (isRelease ? 'bg-white text-black hover:bg-[#E2FF00]' : 'bg-zinc-100 hover:bg-[#E2FF00] text-black')
                      }`}
                      title="Copy Commit SHA"
                    >
                      {copiedId === node.id ? 'COPIED [✓]' : `#${node.id}`}
                    </button>
                  </div>
                  <p className={`text-[10px] mt-1 font-mono italic leading-tight line-clamp-1 ${isRelease ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {hoveredNode && !selectedNode && (
        <div 
          className="fixed z-[100] bg-black text-white p-3 border-2 border-[#E2FF00] brutal-shadow-sm pointer-events-none max-w-xs"
          style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
        >
          <div className="text-[9px] font-mono mb-1 text-[#E2FF00] border-b border-zinc-800 pb-1 flex justify-between uppercase">
            <span>COMMIT_ID</span>
            <span>{hoveredNode.id}</span>
          </div>
          <h4 className="font-black text-xs uppercase">{hoveredNode.label}</h4>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="bg-white border-8 border-black p-6 brutal-shadow max-w-lg w-full relative z-10 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto flex flex-col hud-corner">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black text-white hover:bg-[#E2FF00] hover:text-black p-1 transition-colors z-20 border-2 border-black tactile-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-mono font-black bg-[#E2FF00] text-black px-1.5 py-0.5 border border-black uppercase">
                TYPE: {selectedNode.type}
              </span>
              <span className="text-[9px] font-mono font-bold opacity-60">SHA: {selectedNode.id}</span>
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b-4 border-black mb-4 pr-8 shrink-0 break-words">
              {selectedNode.label}
            </h3>
            <div className="space-y-4 font-mono text-sm overflow-y-auto">
              <p className="bg-zinc-100 p-4 border-2 border-black italic leading-tight break-words">
                "{selectedNode.description}"
              </p>
              <div className="flex flex-col sm:flex-row justify-between text-[10px] font-black gap-2">
                <span>AUTHOR: @{selectedNode.author || 'SYSTEM'}</span>
                <span>DATE: {selectedNode.date}</span>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="mt-6 w-full bg-black text-white hover:bg-[#E2FF00] hover:text-black py-3 font-black uppercase border-4 border-black transition-all shrink-0 tactile-btn"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 text-[9px] font-mono opacity-20 select-none">
        NODE_COUNT: {currentHistory.length} // TARGET: {activeProject.title} // REF: 0x{activeProject.id}
      </div>

      <style>{`
        @keyframes brutal-pulse {
          0%, 100% { transform: scale(1) rotate(45deg); }
          50% { transform: scale(1.1) rotate(45deg); background-color: white; }
        }
        .animate-brutal-pulse {
          animation: brutal-pulse 0.4s cubic-bezier(0.19, 1, 0.22, 1) infinite;
        }
        @keyframes brutal-glow {
          0%, 100% { box-shadow: 2px 2px 0px 0px rgba(0,0,0,1); }
          50% { box-shadow: 0px 0px 8px 1px rgba(0,0,0,0.3); }
        }
        .animate-brutal-glow {
          animation: brutal-glow 0.6s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default GitGraph;

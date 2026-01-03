
import React, { useState, useMemo, useEffect } from 'react';
import { GIT_HISTORY } from '../constants';
import { HistoryNode, Project } from '../types';

interface GitGraphProps {
  activeProject: Project;
}

const GitGraph: React.FC<GitGraphProps> = ({ activeProject }) => {
  const [hoveredNode, setHoveredNode] = useState<HistoryNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<HistoryNode | null>(null);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleNodeClick = (node: HistoryNode) => {
    setSelectedNode(node);
  };

  const closeModal = () => {
    setSelectedNode(null);
  };

  return (
    <div 
      className="p-6 bg-white border-4 border-black brutal-shadow overflow-x-hidden relative min-h-[700px] flex flex-col"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-4 right-4 text-[10px] font-black rotate-90 origin-right tracking-tighter opacity-10 select-none">
        REMOTE_LOG_{activeProject.title}_V4
      </div>
      
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-black border-b-4 border-black pb-1 inline-block italic uppercase">GIT_FLOW_SYNC</h2>
          <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">
            {activeProject.title}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase bg-zinc-100 px-1 border border-black">BRANCH:</span>
          <span className="text-[9px] font-mono font-bold italic opacity-60">origin/main</span>
        </div>
      </div>
      
      <div className={`relative flex-1 transition-opacity duration-200 ${isSyncing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {/* The backbone line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-[3px] bg-black"></div>
        
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
                  border-l-2 border-black pl-3 py-1 transition-transform group-hover:translate-x-1 cursor-pointer flex-1
                  ${isRelease ? 'bg-black text-white px-3 py-2 brutal-shadow-sm' : ''}
                `}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-1 ${isRelease ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {node.date}
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${isRelease ? 'text-lg' : ''}`}>
                      {node.label}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-0.5 font-mono italic leading-tight line-clamp-1 ${isRelease ? 'text-zinc-400' : 'text-zinc-500'}`}>
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
          className="fixed z-[100] bg-black text-white p-3 border-2 border-white brutal-shadow-sm pointer-events-none max-w-xs"
          style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
        >
          <div className="text-[9px] font-mono mb-1 text-zinc-500 border-b border-zinc-800 pb-1 flex justify-between uppercase">
            <span>COMMIT_ID</span>
            <span>{hoveredNode.id}</span>
          </div>
          <h4 className="font-black text-xs uppercase">{hoveredNode.label}</h4>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
          <div className="bg-white border-8 border-black p-6 brutal-shadow max-w-lg w-full relative z-10 animate-in zoom-in-95">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b-4 border-black mb-4">
              {selectedNode.label}
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <p className="bg-zinc-100 p-4 border-2 border-black italic leading-tight">
                "{selectedNode.description}"
              </p>
              <div className="flex justify-between text-[10px] font-black">
                <span>AUTHOR: @{selectedNode.author || 'SYSTEM'}</span>
                <span>DATE: {selectedNode.date}</span>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="mt-6 w-full bg-black text-white py-3 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all"
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


import React, { useState } from 'react';
import { GIT_HISTORY } from '../constants';
import { HistoryNode } from '../types';

const GitGraph: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<HistoryNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<HistoryNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
      className="p-8 bg-white border-4 border-black brutal-shadow overflow-x-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-4 right-4 text-xs font-black rotate-90 origin-right tracking-tighter opacity-10 select-none">
        GIT_HISTORY_CORE_SYSTEM_LOG
      </div>
      
      <h2 className="text-4xl font-black mb-12 border-b-8 border-black pb-2 inline-block italic uppercase">Git_Flow_Graph</h2>
      
      <div className="relative">
        {/* The backbone line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-[4px] bg-black"></div>
        
        <div className="space-y-16">
          {GIT_HISTORY.map((node) => {
            const isCommit = node.type === 'commit';
            const isMerge = node.type === 'merge';
            const isRelease = node.type === 'release';

            return (
              <div 
                key={node.id} 
                className="relative flex items-center gap-8 group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              >
                {/* Node Container */}
                <div className="relative z-10 flex items-center justify-center w-10 h-10 cursor-pointer">
                  {/* Node Shape */}
                  <div className={`
                    absolute transition-all duration-300
                    ${isCommit ? 'w-6 h-6 border-2 border-black bg-white group-hover:bg-black group-hover:scale-150 group-hover:rotate-12' : ''}
                    ${isMerge ? 'w-9 h-9 border-4 border-black bg-zinc-200 rotate-45 group-hover:bg-black group-hover:animate-brutal-pulse' : ''}
                    ${isRelease ? 'w-12 h-12 border-4 border-black bg-black text-white brutal-shadow-sm flex items-center justify-center scale-110 group-hover:animate-brutal-glow' : ''}
                  `}>
                    {/* Content inside node */}
                    <span className={`
                      font-mono font-black select-none
                      ${isCommit ? 'hidden' : ''}
                      ${isMerge ? '-rotate-45 text-[10px] text-black group-hover:text-white' : ''}
                      ${isRelease ? 'text-lg' : ''}
                    `}>
                      {isMerge ? 'M' : isRelease ? '!' : ''}
                    </span>
                  </div>
                  
                  {isCommit && (
                    <span className="text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-white z-20">
                      C
                    </span>
                  )}
                </div>
                
                {/* Content info */}
                <div className={`
                  border-l-4 border-black pl-4 py-1 transition-transform group-hover:translate-x-2 cursor-pointer
                  ${isRelease ? 'bg-black text-white px-4 py-2 brutal-shadow-sm' : ''}
                `}>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold px-1 ${isRelease ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {node.date}
                    </span>
                    <span className={`text-sm font-black uppercase tracking-tighter ${isRelease ? 'text-xl' : ''}`}>
                      {node.label}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 font-mono italic max-w-md ${isRelease ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {node.description}
                  </p>
                </div>

                {isMerge && (
                  <div className="absolute -left-12 top-1/2 w-12 h-[4px] bg-black -z-10 opacity-30"></div>
                )}
                {isRelease && (
                  <div className="absolute -left-4 top-0 w-20 h-20 border-2 border-dashed border-black opacity-10 rounded-full animate-spin-slow"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Interactive Tooltip (on hover) */}
      {hoveredNode && !selectedNode && (
        <div 
          className="fixed z-[100] bg-black text-white p-4 border-2 border-white brutal-shadow pointer-events-none max-w-xs"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20 
          }}
        >
          <div className="text-[10px] font-mono mb-2 text-zinc-400 border-b border-zinc-700 pb-1 flex justify-between uppercase">
            <span>Commit_Peek</span>
            <span>ID: {hoveredNode.id}</span>
          </div>
          <h4 className="font-black text-sm uppercase mb-1">{hoveredNode.label}</h4>
          <div className="text-[10px] font-mono">Click for full Intel_Report</div>
        </div>
      )}

      {/* Detail Modal (on click) */}
      {selectedNode && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
          <div className="bg-white border-8 border-black p-8 brutal-shadow max-w-2xl w-full relative z-10 animate-in slide-in-from-bottom-12 duration-300">
            <button 
              onClick={closeModal}
              className="absolute -top-6 -right-6 bg-black text-white p-2 border-4 border-white hover:bg-white hover:text-black hover:border-black transition-all font-black text-xl brutal-shadow-sm"
            >
              [X]
            </button>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
                <div>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                    {selectedNode.label}
                  </h3>
                  <div className="mt-2 flex gap-4 text-xs font-mono font-bold uppercase">
                    <span className="bg-black text-white px-2 py-1">ID: {selectedNode.id}</span>
                    <span className="border-2 border-black px-2 py-1">TYPE: {selectedNode.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black italic block leading-none">{selectedNode.date}</span>
                  <span className="text-[10px] font-mono uppercase opacity-50">STAMP_ID_{new Date(selectedNode.date).getTime()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1 bg-black shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase mb-2">SYSTEM_LOG_DESCRIPTION</h4>
                    <p className="text-lg font-mono leading-tight">{selectedNode.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t-2 border-dashed border-black">
                  <div>
                    <h4 className="text-xs font-black uppercase mb-1">AUTHORED_BY</h4>
                    <div className="flex items-center gap-3 bg-zinc-100 p-2 border-2 border-black">
                      <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-xs">
                        {selectedNode.author?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <span className="font-mono font-bold text-sm">@{selectedNode.author || 'system_root'}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase mb-1">BRANCH_AFFECTED</h4>
                    <div className="font-mono font-bold text-sm bg-black text-white p-2 border-2 border-black inline-block">
                      * core/master
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button 
                  onClick={closeModal}
                  className="bg-black text-white px-6 py-2 font-black uppercase hover:bg-white hover:text-black border-4 border-black transition-all brutal-shadow-sm"
                >
                  DISMISS_INTEL
                </button>
                <button 
                  className="border-4 border-black px-6 py-2 font-black uppercase hover:bg-black hover:text-white transition-all brutal-shadow-sm"
                  onClick={() => window.alert('DEBUG: Raw binary diff not available in this terminal.')}
                >
                  VIEW_RAW_DIFF
                </button>
              </div>
            </div>

            {/* Aesthetic Chaos in Modal */}
            <div className="absolute bottom-4 right-4 text-[10px] font-mono opacity-20 pointer-events-none select-none">
              SECURE_HSA_256_VERIFIED
            </div>
          </div>
        </div>
      )}

      {/* Decorative Chaos Elements */}
      <div className="mt-12 text-[10px] font-mono opacity-30 select-none">
        {`[system] node_count: ${GIT_HISTORY.length}`}
        <br />
        {`[system] last_sync: ${new Date().toISOString()}`}
        <br />
        {`[git] log --graph --oneline --all`}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }
        @keyframes animate-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .slide-in-from-bottom-12 {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-in {
          from { transform: translateY(48px); }
          to { transform: translateY(0); }
        }

        /* New Subtle Node Animations */
        @keyframes brutal-pulse {
          0%, 100% { transform: scale(1) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); background-color: white; }
        }
        .animate-brutal-pulse {
          animation: brutal-pulse 0.4s cubic-bezier(0.19, 1, 0.22, 1) infinite;
        }

        @keyframes brutal-glow {
          0%, 100% { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); filter: brightness(1); }
          50% { box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.4); filter: brightness(1.2); }
        }
        .animate-brutal-glow {
          animation: brutal-glow 0.6s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default GitGraph;

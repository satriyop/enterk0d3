
import React, { useState } from 'react';
import { GIT_HISTORY } from '../constants';
import { HistoryNode } from '../types';

const GitGraph: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<HistoryNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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
          {GIT_HISTORY.map((node, i) => {
            const isCommit = node.type === 'commit';
            const isMerge = node.type === 'merge';
            const isRelease = node.type === 'release';

            return (
              <div 
                key={node.id} 
                className="relative flex items-center gap-8 group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Container */}
                <div className="relative z-10 flex items-center justify-center w-10 h-10 cursor-help">
                  {/* Node Shape */}
                  <div className={`
                    absolute transition-all duration-300
                    ${isCommit ? 'w-6 h-6 border-2 border-black bg-white group-hover:bg-black group-hover:scale-110' : ''}
                    ${isMerge ? 'w-9 h-9 border-4 border-black bg-zinc-200 rotate-45 group-hover:bg-black group-hover:scale-110' : ''}
                    ${isRelease ? 'w-12 h-12 border-4 border-black bg-black text-white brutal-shadow-sm flex items-center justify-center scale-110 group-hover:scale-125' : ''}
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
                  
                  {/* Labels for commits since they don't have internal text */}
                  {isCommit && (
                    <span className="text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      C
                    </span>
                  )}
                </div>
                
                {/* Content info */}
                <div className={`
                  border-l-4 border-black pl-4 py-1 transition-transform group-hover:translate-x-2
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

                {/* Decorative branch lines / Chaos markers */}
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
      
      {/* Interactive Tooltip */}
      {hoveredNode && (
        <div 
          className="fixed z-[100] bg-black text-white p-4 border-2 border-white brutal-shadow pointer-events-none max-w-xs"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20 
          }}
        >
          <div className="text-[10px] font-mono mb-2 text-zinc-400 border-b border-zinc-700 pb-1 flex justify-between uppercase">
            <span>Commit_Details</span>
            <span>ID: {hoveredNode.id}</span>
          </div>
          <h4 className="font-black text-sm uppercase mb-1">{hoveredNode.label}</h4>
          <p className="text-xs font-mono mb-3 leading-tight text-zinc-200">
            {hoveredNode.description}
          </p>
          <div className="text-[10px] font-mono flex items-center gap-2">
            <span className="bg-white text-black px-1 font-black">AUTHOR</span>
            <span>{hoveredNode.author || 'system'}</span>
          </div>
          <div className="mt-2 text-[8px] font-mono text-zinc-500 italic">
            TIMESTAMP: {new Date(hoveredNode.date).getTime()}
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
      `}</style>
    </div>
  );
};

export default GitGraph;

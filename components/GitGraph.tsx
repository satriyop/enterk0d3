
import React from 'react';
import { GIT_HISTORY } from '../constants';

const GitGraph: React.FC = () => {
  return (
    <div className="p-8 bg-white border-4 border-black brutal-shadow overflow-x-hidden relative">
      <div className="absolute top-4 right-4 text-xs font-black rotate-90 origin-right tracking-tighter opacity-10 select-none">
        GIT_HISTORY_CORE_SYSTEM_LOG
      </div>
      
      <h2 className="text-4xl font-black mb-12 border-b-8 border-black pb-2 inline-block italic">GIT_FLOW</h2>
      
      <div className="relative">
        {/* The backbone line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-[4px] bg-black"></div>
        
        <div className="space-y-16">
          {GIT_HISTORY.map((node, i) => (
            <div key={node.id} className="relative flex items-center gap-8 group">
              {/* Node Circle */}
              <div className={`z-10 w-10 h-10 rounded-none border-4 border-black bg-white flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white ${
                node.type === 'merge' ? 'rotate-45' : 
                node.type === 'release' ? 'scale-125 bg-black text-white' : ''
              }`}>
                <span className="text-[10px] font-bold">
                  {node.type === 'commit' ? 'C' : node.type === 'merge' ? 'M' : 'R'}
                </span>
              </div>
              
              {/* Content */}
              <div className="border-l-4 border-black pl-4 py-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-black text-white px-1">{node.date}</span>
                  <span className="text-sm font-black uppercase tracking-widest">{node.label}</span>
                </div>
                <p className="text-xs mt-1 text-zinc-600 font-mono italic max-w-md">{node.description}</p>
              </div>

              {/* Decorative branch lines for "chaos" feel */}
              {i % 2 === 0 && (
                <div className="absolute -left-8 top-1/2 w-8 h-[2px] bg-black opacity-20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Chaos Elements */}
      <div className="mt-12 text-[10px] font-mono opacity-30 select-none">
        {`[system] core: 0x${Math.random().toString(16).slice(2, 10)} initialized`}
        <br />
        {`[system] heap: 2.4GB / 4.0GB occupied`}
        <br />
        {`[git] diff HEAD~1..HEAD --name-only`}
      </div>
    </div>
  );
};

export default GitGraph;

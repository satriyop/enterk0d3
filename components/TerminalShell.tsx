
import React, { useState, useRef, useEffect } from 'react';
import { TerminalMessage } from '../types';
import { askOracle } from '../services/geminiService';

const TerminalShell: React.FC = () => {
  const [history, setHistory] = useState<TerminalMessage[]>([
    { type: 'system', content: 'SYSTEM_BOOT_COMPLETE' },
    { type: 'system', content: 'TYPE "help" FOR COMMANDS' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory: TerminalMessage[] = [...history, { type: 'input', content: input }];
    setHistory(newHistory);
    setInput('');

    if (cmd === 'help') {
      setHistory(prev => [...prev, { type: 'output', content: 'AVAILABLE COMMANDS: [whoami, projects, git, oracle <query>, clear]' }]);
    } else if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'whoami') {
      setHistory(prev => [...prev, { type: 'output', content: 'USER: enterk0d3 | STATUS: ARCHITECT | LOC: NULL_SPACE' }]);
    } else if (cmd.startsWith('oracle ')) {
      const query = cmd.replace('oracle ', '');
      setIsThinking(true);
      const answer = await askOracle(query);
      setIsThinking(false);
      setHistory(prev => [...prev, { type: 'output', content: `ORACLE > ${answer}` }]);
    } else if (cmd === 'projects') {
      setHistory(prev => [...prev, { type: 'output', content: 'FETCHING REPOS... [VOID_ENGINE, NEURAL_SHELL, GHOST_PROTOCOL]' }]);
    } else {
      setHistory(prev => [...prev, { type: 'error', content: `COMMAND NOT FOUND: ${cmd}` }]);
    }
  };

  return (
    <div className="bg-black text-white p-6 border-4 border-black font-mono brutal-shadow h-[400px] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
        <span className="text-xs uppercase font-bold tracking-widest">System_Terminal_v4.0.1</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-white"></div>
          <div className="w-3 h-3 border border-white"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-1">
        {history.map((msg, i) => (
          <div key={i} className={`text-sm ${
            msg.type === 'error' ? 'text-red-500' : 
            msg.type === 'input' ? 'text-green-400' : 
            msg.type === 'system' ? 'text-zinc-500 italic' : 
            'text-white'
          }`}>
            {msg.type === 'input' && <span>$ </span>}
            {msg.content}
          </div>
        ))}
        {isThinking && (
          <div className="text-zinc-500 animate-pulse text-sm">ORACLE IS THINKING...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex gap-2 border-t border-white/20 pt-4">
        <span className="text-green-400 font-bold">$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none text-white flex-1 font-mono text-sm"
          autoFocus
        />
      </form>
    </div>
  );
};

export default TerminalShell;

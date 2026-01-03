
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalMessage } from '../types';
import { askOracle } from '../services/geminiService';

const TerminalShell: React.FC = () => {
  const [history, setHistory] = useState<TerminalMessage[]>([
    { type: 'system', content: 'SYSTEM_BOOT_COMPLETE' },
    { type: 'system', content: 'TYPE "help" FOR COMMANDS' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = useCallback(async (fullCommand: string) => {
    const trimmedInput = fullCommand.trim();
    if (!trimmedInput) return;

    const cmd = trimmedInput.toLowerCase();
    
    // Update command history for arrow navigation
    setCommandHistory(prev => [trimmedInput, ...prev.filter(c => c !== trimmedInput)].slice(0, 50));
    setHistoryIndex(-1);

    const newHistory: TerminalMessage[] = [...history, { type: 'input', content: trimmedInput }];
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
    } else if (cmd === 'git') {
      setHistory(prev => [...prev, { type: 'output', content: 'usage: git <command> [<args>]\n\nSupported commands: status, log, branch' }]);
    } else if (cmd === 'git status') {
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: 'On branch core\nYour branch is up to date with \'origin/core\'.\n\nnothing to commit, working tree clean' 
      }]);
    } else if (cmd === 'git log') {
      const gitLogContent = `commit a1b2c3d (HEAD -> core)
Author: enterk0d3 <system@enterk0d3.com>
Date:   Wed Jun 5 14:32:10 2024

    FEATURE: AI_ORACLE integration

commit f4e5d6c
Author: enterk0d3 <system@enterk0d3.com>
Date:   Sun May 12 09:15:44 2024

    FIX: memory leak optimization

--- VISUAL_GRAPH ---
*  [a1b2c3d] (HEAD -> core) FEATURE: AI_ORACLE
|
*  [f4e5d6c] FIX: memory leak
|
*  [9z8y7x6] RELEASE: ALPHA_1
|\\
| * [h3_sub] MERGE: PROTOTYPE_v2
|/
*  [h2_root] FEATURE: RAW_WEBGL
|
*  [h1_init] INITIAL_COMMIT`;

      setHistory(prev => [...prev, { 
        type: 'output', 
        content: gitLogContent
      }]);
    } else if (cmd === 'git branch') {
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: '* core\n  experimental-gl\n  ghost-protocol-fix\n  chaos-theory-v2' 
      }]);
    } else {
      setHistory(prev => [...prev, { type: 'error', content: `COMMAND NOT FOUND: ${cmd}` }]);
    }
  }, [history]);

  // Listen for external command events (e.g., from Command Palette)
  useEffect(() => {
    const handleExternalCmd = (e: any) => {
      if (e.detail) {
        executeCommand(e.detail);
      }
    };
    window.addEventListener('TERMINAL_CMD', handleExternalCmd);
    return () => window.removeEventListener('TERMINAL_CMD', handleExternalCmd);
  }, [executeCommand]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      id="terminal-section"
      className="bg-black text-white p-6 border-4 border-black font-mono brutal-shadow h-[400px] overflow-hidden flex flex-col cursor-text scroll-mt-24"
      onClick={focusInput}
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
        <span className="text-xs uppercase font-bold tracking-widest">System_Terminal_v4.0.1</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-white"></div>
          <div className="w-3 h-3 border border-white"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-hide">
        {history.map((msg, i) => (
          <div key={i} className={`text-sm whitespace-pre-wrap ${
            msg.type === 'error' ? 'text-red-500' : 
            msg.type === 'input' ? 'text-green-400' : 
            msg.type === 'system' ? 'text-zinc-500 italic' : 
            'text-white'
          }`}>
            {msg.type === 'input' && <span className="font-bold">$ </span>}
            {msg.content}
          </div>
        ))}
        {isThinking && (
          <div className="text-zinc-500 animate-pulse text-sm">ORACLE IS THINKING...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-white/20 pt-4 relative">
        <span className="text-green-400 font-bold">$</span>
        <div className="flex-1 relative font-mono text-sm flex items-center">
          <span className="whitespace-pre">{input}</span>
          <span className="w-2.5 h-4 bg-white ml-0.5 animate-cursor-blink"></span>
          <input 
            ref={inputRef}
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full bg-transparent border-none outline-none text-transparent caret-transparent font-mono text-sm selection:bg-white/20"
            autoFocus
          />
        </div>
      </form>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 0.8s step-end infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TerminalShell;

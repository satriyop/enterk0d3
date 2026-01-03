
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalMessage, GitHubContent, Project } from '../types';
import { askOracle } from '../services/geminiService';
import { fetchRepoContents, fetchFileContent } from '../services/githubService';

interface TerminalShellProps {
  activeProject?: Project;
}

const TerminalShell: React.FC<TerminalShellProps> = ({ activeProject }) => {
  const [history, setHistory] = useState<TerminalMessage[]>([
    { type: 'system', content: 'SYSTEM_BOOT_COMPLETE' },
    { type: 'system', content: 'TYPE "help" FOR COMMANDS' }
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('');
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

    const parts = trimmedInput.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    setCommandHistory(prev => [trimmedInput, ...prev.filter(c => c !== trimmedInput)].slice(0, 50));
    setHistoryIndex(-1);

    setHistory(prev => [...prev, { type: 'input', content: trimmedInput }]);
    setInput('');

    const repoPath = activeProject?.repo.replace('github.com/', '');

    switch (cmd) {
      case 'help':
        setHistory(prev => [...prev, { type: 'output', content: 'AVAILABLE COMMANDS: [ls, cd <dir>, cat <file>, whoami, projects, git, oracle <query>, clear]' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'output', content: 'USER: satriyop | STATUS: ARCHITECT | NODE: ' + (activeProject?.title || 'GLOBAL') }]);
        break;
      case 'ls':
        if (!repoPath) {
          setHistory(prev => [...prev, { type: 'error', content: 'SYSTEM_ERROR: NO_PROJECT_ACTIVE' }]);
          return;
        }
        setIsThinking(true);
        const contents = await fetchRepoContents(repoPath, currentPath);
        setIsThinking(false);
        const listStr = contents.map(c => `${c.type === 'dir' ? '[DIR]' : '     '} ${c.name}`).join('\n');
        setHistory(prev => [...prev, { type: 'output', content: listStr || 'DIRECTORY_EMPTY' }]);
        break;
      case 'cd':
        if (!repoPath) {
          setHistory(prev => [...prev, { type: 'error', content: 'SYSTEM_ERROR: NO_PROJECT_ACTIVE' }]);
          return;
        }
        const target = args[0];
        if (!target || target === '.') break;
        if (target === '..') {
          const parts = currentPath.split('/').filter(Boolean);
          parts.pop();
          setCurrentPath(parts.join('/'));
        } else {
          setCurrentPath(prev => (prev ? `${prev}/${target}` : target));
        }
        break;
      case 'cat':
        if (!repoPath) {
          setHistory(prev => [...prev, { type: 'error', content: 'SYSTEM_ERROR: NO_PROJECT_ACTIVE' }]);
          return;
        }
        const file = args[0];
        if (!file) {
          setHistory(prev => [...prev, { type: 'error', content: 'USAGE: cat <filename>' }]);
          break;
        }
        setIsThinking(true);
        const dirContents = await fetchRepoContents(repoPath, currentPath);
        const targetFile = dirContents.find(c => c.name === file && c.type === 'file');
        if (targetFile?.download_url) {
          const text = await fetchFileContent(targetFile.download_url);
          setIsThinking(false);
          setHistory(prev => [...prev, { type: 'output', content: text.substring(0, 2000) + (text.length > 2000 ? '\n... [TRUNCATED]' : '') }]);
        } else {
          setIsThinking(false);
          setHistory(prev => [...prev, { type: 'error', content: 'FILE_NOT_FOUND: ' + file }]);
        }
        break;
      case 'oracle':
        const query = args.join(' ');
        setIsThinking(true);
        const answer = await askOracle(query);
        setIsThinking(false);
        setHistory(prev => [...prev, { type: 'output', content: `ORACLE > ${answer}` }]);
        break;
      case 'projects':
        setHistory(prev => [...prev, { type: 'output', content: 'FETCHING REPOS... [VOID_ENGINE, NEURAL_SHELL, GHOST_PROTOCOL]' }]);
        break;
      case 'git':
        if (args[0] === 'status') {
          setHistory(prev => [...prev, { type: 'output', content: `On branch main\nNode: ${activeProject?.title}\nHash: ${activeProject?.commitHash}\nWorking tree clean.` }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', content: 'usage: git <status|log|branch>' }]);
        }
        break;
      default:
        setHistory(prev => [...prev, { type: 'error', content: `COMMAND NOT FOUND: ${cmd}` }]);
    }
  }, [history, activeProject, currentPath]);

  useEffect(() => {
    const handleExternalCmd = (e: any) => {
      if (e.detail) executeCommand(e.detail);
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

  return (
    <div 
      id="terminal-section"
      className="bg-black text-white p-6 border-4 border-black font-mono brutal-shadow h-[400px] overflow-hidden flex flex-col cursor-text scroll-mt-24"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
        <span className="text-xs uppercase font-bold tracking-widest">
          {activeProject ? `NODE_${activeProject.title}` : 'SYSTEM_ROOT'}@V4.0.1
        </span>
        <div className="flex gap-2 text-[10px] font-bold opacity-50">
          <span>PATH: /{activeProject?.title.toLowerCase()}{currentPath ? `/${currentPath}` : ''}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-hide">
        {history.map((msg, i) => (
          <div key={i} className={`text-sm whitespace-pre-wrap ${
            msg.type === 'error' ? 'text-red-500 font-bold' : 
            msg.type === 'input' ? 'text-green-400' : 
            msg.type === 'system' ? 'text-zinc-500 italic' : 
            'text-white'
          }`}>
            {msg.type === 'input' && <span className="font-bold">$ </span>}
            {msg.content}
          </div>
        ))}
        {isThinking && (
          <div className="text-zinc-500 animate-pulse text-sm">PROCESSING_DATA_STREAM...</div>
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
            className="absolute inset-0 w-full bg-transparent border-none outline-none text-transparent caret-transparent font-mono text-sm"
            autoFocus
          />
        </div>
      </form>

      <style>{`
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-cursor-blink { animation: cursor-blink 0.8s step-end infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TerminalShell;


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Project } from '../types';

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
  category: 'NAVIGATION' | 'SYSTEM' | 'SOCIAL' | 'PROJECTS';
}

interface CommandPaletteProps {
  projects?: Project[];
  onProjectSelect?: (project: Project) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ projects = [], onProjectSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const baseCommands: Command[] = [
    { id: 'nav-projects', label: 'Go to Projects', shortcut: 'G P', category: 'NAVIGATION', action: () => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'nav-git', label: 'Go to Git Flow', shortcut: 'G G', category: 'NAVIGATION', action: () => document.getElementById('git-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'nav-terminal', label: 'Go to Terminal', shortcut: 'G T', category: 'NAVIGATION', action: () => document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'sys-clear', label: 'Terminal: Clear History', category: 'SYSTEM', action: () => window.dispatchEvent(new CustomEvent('TERMINAL_CMD', { detail: 'clear' })) },
    { id: 'sys-whoami', label: 'Terminal: Run Whoami', category: 'SYSTEM', action: () => window.dispatchEvent(new CustomEvent('TERMINAL_CMD', { detail: 'whoami' })) },
    { id: 'soc-github', label: 'Contact: GitHub', shortcut: 'C G', category: 'SOCIAL', action: () => window.open('https://github.com/satriyop', '_blank') },
    { id: 'soc-twitter', label: 'Contact: Twitter', shortcut: 'C T', category: 'SOCIAL', action: () => window.open('https://twitter.com/satriyop', '_blank') },
    { id: 'soc-email', label: 'Contact: Email', category: 'SOCIAL', action: () => window.location.href = 'mailto:satriyo@enterk0d3.com' },
  ];

  const projectCommands: Command[] = useMemo(() => {
    return projects.map(p => ({
      id: `proj-${p.id}`,
      label: `Switch to: ${p.title}`,
      category: 'PROJECTS' as const,
      action: () => {
        if (onProjectSelect) onProjectSelect(p);
        document.getElementById('git-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }));
  }, [projects, onProjectSelect]);

  const allCommands = useMemo(() => [...baseCommands, ...projectCommands], [baseCommands, projectCommands]);

  const filteredCommands = useMemo(() => {
    return allCommands.filter(cmd => 
      cmd.label.toLowerCase().includes(search.toLowerCase()) || 
      cmd.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allCommands]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      {/* Palette */}
      <div className="relative w-full max-w-xl bg-white border-8 border-black brutal-shadow animate-palette-in flex flex-col max-h-[60vh]">
        {/* Search Input */}
        <div className="flex items-center p-4 border-b-4 border-black gap-4 bg-zinc-100">
          <span className="text-xl font-black">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-mono text-lg uppercase placeholder:text-black/30"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="text-[10px] font-black border-2 border-black px-1 bg-white">ESC_TO_CLOSE</div>
        </div>

        {/* Command List */}
        <div ref={listRef} className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-brutal">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`flex items-center justify-between p-3 cursor-pointer transition-all border-2 ${
                  index === selectedIndex ? 'bg-black text-white border-black translate-x-1' : 'bg-white text-black border-transparent hover:border-black/20'
                }`}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[8px] font-mono px-1 border min-w-[60px] text-center ${index === selectedIndex ? 'border-white text-white' : 'border-black text-black'}`}>
                    {cmd.category}
                  </span>
                  <span className="font-black text-sm uppercase">{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <span className={`text-[10px] font-mono ${index === selectedIndex ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {cmd.shortcut}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-black/20">
              <p className="font-mono text-sm uppercase opacity-40 italic">NO_MATCHING_COMMANDS_FOUND</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-2 bg-zinc-50 flex justify-between items-center px-4">
          <div className="flex gap-4 text-[9px] font-black uppercase opacity-60">
            <span>↑↓ Navigate</span>
            <span>↵ Execute</span>
          </div>
          <span className="text-[9px] font-mono opacity-40 uppercase">USER: SATRIYOP @ CMD_CTR</span>
        </div>
      </div>

      <style>{`
        @keyframes palette-in {
          from { transform: translateY(-20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-palette-in {
          animation: palette-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;

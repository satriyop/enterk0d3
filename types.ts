
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repo: string;
  commitHash: string;
}

export interface HistoryNode {
  id: string;
  label: string;
  type: 'commit' | 'merge' | 'release';
  date: string;
  description: string;
}

export interface TerminalMessage {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

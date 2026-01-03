
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repo: string;
  commitHash: string;
  previewUrl?: string;
  history?: HistoryNode[];
}

export interface HistoryNode {
  id: string;
  label: string;
  type: 'commit' | 'merge' | 'release';
  date: string;
  description: string;
  author?: string;
}

export interface TerminalMessage {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: { login: string };
  repo: { name: string };
  payload: any;
  created_at: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

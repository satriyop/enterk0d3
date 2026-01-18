import { GitHubEvent, GitHubContent, HistoryNode } from '../types';

const BASE_URL = '/api/github';

export const fetchUserEvents = async (username: string): Promise<GitHubEvent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/events/public`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    console.error('GitHub API Error:', error);
    return [];
  }
};

export const fetchUserRepos = async (username: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error('Failed to fetch repos');
    return await response.json();
  } catch (error) {
    console.error('GitHub API Error:', error);
    return [];
  }
};

export const fetchRepoContents = async (repoPath: string, path: string = ''): Promise<GitHubContent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/repos/${repoPath}/contents/${path}`);
    if (!response.ok) throw new Error('Failed to fetch contents');
    return await response.json();
  } catch (error) {
    console.error('GitHub API Error:', error);
    return [];
  }
};

export const fetchFileContent = async (downloadUrl: string): Promise<string> => {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch file');
    return await response.text();
  } catch (error) {
    console.error('GitHub API Error:', error);
    return 'ERROR_READING_FILE_STREAM';
  }
};

export const fetchLatestCommitHash = async (repoPath: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/repos/${repoPath}/commits?per_page=1`);
    if (!response.ok) throw new Error('Failed to fetch commit hash');
    const data = await response.json();
    return data[0]?.sha?.substring(0, 7) || 'UNKNOWN';
  } catch (error) {
    return 'N/A';
  }
};

export const fetchRepoCommits = async (repoPath: string): Promise<HistoryNode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/repos/${repoPath}/commits?per_page=10`);
    if (!response.ok) throw new Error('Failed to fetch commits');
    const data = await response.json();
    return data.map((item: any) => {
      const message = item.commit.message;
      const isMerge = message.toLowerCase().startsWith('merge');
      const isRelease = message.toLowerCase().includes('release') || message.toLowerCase().startsWith('v');
      
      return {
        id: item.sha.substring(0, 7),
        label: message.split('\n')[0].toUpperCase(),
        type: isRelease ? 'release' : (isMerge ? 'merge' : 'commit'),
        date: item.commit.author.date.split('T')[0],
        description: message,
        author: item.author?.login || item.commit.author.name
      };
    });
  } catch (error) {
    console.error('GitHub API Error (Commits):', error);
    return [];
  }
};
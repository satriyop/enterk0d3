
import { GitHubEvent, GitHubContent } from '../types';

const BASE_URL = 'https://api.github.com';

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

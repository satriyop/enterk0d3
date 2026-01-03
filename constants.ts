
import { Project, HistoryNode } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'VOID_ENGINE',
    description: 'High-performance rendering pipeline for **brutalist interfaces**. Built with `raw webgl` and zero dependencies. Features include:\n* Linear Algebra Core\n* Custom Shader Hot-Reload\n* Zero-Alloc Buffer Management',
    tags: ['WebGL', 'TS', 'Low-Level'],
    repo: 'github.com/enterk0d3/void-engine',
    commitHash: 'a1b2c3d'
  },
  {
    id: '2',
    title: 'NEURAL_SHELL',
    description: 'A custom shell environment that predicts your next command using **local LLM integration**. *Stop typing repetitive boilerplates.*',
    tags: ['Rust', 'AI', 'CLI'],
    repo: 'github.com/enterk0d3/neural-shell',
    commitHash: 'f4e5d6c'
  },
  {
    id: '3',
    title: 'GHOST_PROTOCOL',
    description: 'Decentralized identity layer for the dark web, ensuring **perfect anonymity**. Uses `zk-SNARKs` for zero-knowledge verification.',
    tags: ['Blockchain', 'P2P', 'Security'],
    repo: 'github.com/enterk0d3/ghost-protocol',
    commitHash: '9z8y7x6'
  }
];

export const GIT_HISTORY: HistoryNode[] = [
  { id: 'h1', label: 'INITIAL_COMMIT', type: 'commit', date: '2024-01-10', description: 'System instantiation.' },
  { id: 'h2', label: 'FEATURE: RAW_WEBGL', type: 'commit', date: '2024-02-15', description: 'Implementing the visual core.' },
  { id: 'h3', label: 'MERGE: PROTOTYPE_v2', type: 'merge', date: '2024-03-01', description: 'Merging experimental branches.' },
  { id: 'h4', label: 'RELEASE: ALPHA_1', type: 'release', date: '2024-04-20', description: 'First public deployment.' },
  { id: 'h5', label: 'FIX: MEMORY_LEAK', type: 'commit', date: '2024-05-12', description: 'Optimizing garbage collection.' },
  { id: 'h6', label: 'FEATURE: AI_ORACLE', type: 'commit', date: '2024-06-05', description: 'Integration of Gemini intelligence.' }
];

export const ASCII_LOGO = `
 ███████╗███╗   ██╗████████╗███████╗██████╗ ██╗  ██╗ ██████╗ ██████╗ ██████╗ 
 ██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██║ ██╔╝██╔═████╗██╔══██╗╚════██╗
 █████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╔╝ ██║██╔██║██║  ██║ █████╔╝
 ██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔═██╗ ████╔╝██║██║  ██║ ╚═══██╗
 ███████╗██║ ╚████║   ██║   ███████╗██║  ██║██║  ██╗╚██████╔╝██████╔╝██████╔╝
 ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ 
`;

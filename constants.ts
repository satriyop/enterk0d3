
import { Project, HistoryNode } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'VOID_ENGINE',
    description: 'High-performance rendering pipeline for **brutalist interfaces**. Built with `raw webgl` and zero dependencies. Features include:\n* Linear Algebra Core\n* Custom Shader Hot-Reload\n* Zero-Alloc Buffer Management',
    tags: ['WebGL', 'TS', 'Low-Level'],
    repo: 'github.com/enterk0d3/void-engine',
    commitHash: 'a1b2c3d',
    previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&h=300&auto=format&fit=crop&sat=-100',
    history: [
      { id: 'v1', label: 'INITIALIZE_CORE', type: 'commit', date: '2024-05-01', description: 'Raw WebGL context setup.', author: 'enterk0d3' },
      { id: 'v2', label: 'ADD_SHADER_COMPILER', type: 'commit', date: '2024-05-15', description: 'Internal GLSL hot-reloader.', author: 'enterk0d3' },
      { id: 'v3', label: 'RELEASE: v0.1-ALPHA', type: 'release', date: '2024-06-01', description: 'First stable rendering pass.', author: 'system' }
    ]
  },
  {
    id: '2',
    title: 'NEURAL_SHELL',
    description: 'A custom shell environment that predicts your next command using **local LLM integration**. *Stop typing repetitive boilerplates.*',
    tags: ['Rust', 'AI', 'CLI'],
    repo: 'github.com/enterk0d3/neural-shell',
    commitHash: 'f4e5d6c',
    previewUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=300&auto=format&fit=crop&sat=-100',
    history: [
      { id: 'n1', label: 'INIT_RUST_CRATE', type: 'commit', date: '2024-03-10', description: 'Base project structure.', author: 'enterk0d3' },
      { id: 'n2', label: 'LLM_INTEGRATION', type: 'commit', date: '2024-04-05', description: 'Connecting local llama weights.', author: 'enterk0d3' },
      { id: 'n3', label: 'MERGE_AUTOCOMPLETE', type: 'merge', date: '2024-04-20', description: 'Merging experimental-completion branch.', author: 'enterk0d3' }
    ]
  },
  {
    id: '3',
    title: 'GHOST_PROTOCOL',
    description: 'Decentralized identity layer for the dark web, ensuring **perfect anonymity**. Uses `zk-SNARKs` for zero-knowledge verification.',
    tags: ['Blockchain', 'P2P', 'Security'],
    repo: 'github.com/enterk0d3/ghost-protocol',
    commitHash: '9z8y7x6',
    previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=400&h=300&auto=format&fit=crop&sat=-100',
    history: [
      { id: 'g1', label: 'PROTO_DEFINITION', type: 'commit', date: '2023-12-01', description: 'Defining the P2P handshake.', author: 'ghost_node' },
      { id: 'g2', label: 'ZK_CIRCUIT_IMPLEMENTATION', type: 'commit', date: '2024-01-20', description: 'SnarkyJS circuits deployment.', author: 'enterk0d3' },
      { id: 'g3', label: 'RELEASE: DARKNET_v1', type: 'release', date: '2024-03-15', description: 'Mainnet shadow launch.', author: 'enterk0d3' }
    ]
  }
];

export const GIT_HISTORY: HistoryNode[] = [
  { id: 'h1', label: 'INITIAL_COMMIT', type: 'commit', date: '2024-01-10', description: 'System instantiation.', author: 'enterk0d3' },
  { id: 'h2', label: 'FEATURE: RAW_WEBGL', type: 'commit', date: '2024-02-15', description: 'Implementing the visual core.', author: 'enterk0d3' },
  { id: 'h3', label: 'MERGE: PROTOTYPE_v2', type: 'merge', date: '2024-03-01', description: 'Merging experimental branches.', author: 'system_bot' },
  { id: 'h4', label: 'RELEASE: ALPHA_1', type: 'release', date: '2024-04-20', description: 'First public deployment.', author: 'enterk0d3' },
  { id: 'h5', label: 'FIX: MEMORY_LEAK', type: 'commit', date: '2024-05-12', description: 'Optimizing garbage collection.', author: 'enterk0d3' },
  { id: 'h6', label: 'FEATURE: AI_ORACLE', type: 'commit', date: '2024-06-05', description: 'Integration of Gemini intelligence.', author: 'enterk0d3' }
];

export const ASCII_LOGO = `
 ███████╗███╗   ██╗████████╗███████╗██████╗ ██╗  ██╗ ██████╗ ██████╗ ██████╗ 
 ██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██║ ██╔╝██╔═████╗██╔══██╗╚════██╗
 █████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╔╝ ██║██╔██║██║  ██║ █████╔╝
 ██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔═██╗ ████╔╝██║██║  ██║ ╚═══██╗
 ███████╗██║ ╚████║   ██║   ███████╗██║  ██║██║  ██╗╚██████╔╝██████╔╝██████╔╝
 ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ 
`;


import React, { useState, useEffect } from 'react';
import { ASCII_LOGO, PROJECTS as FALLBACK_PROJECTS } from './constants';
import TerminalShell from './components/TerminalShell';
import GitGraph from './components/GitGraph';
import ProjectGrid from './components/ProjectGrid';
import CommandPalette from './components/CommandPalette';
import HeartbeatTicker from './components/HeartbeatTicker';
import { Project } from './types';
import { fetchUserRepos, fetchLatestCommitHash, fetchRepoCommits } from './services/githubService';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(FALLBACK_PROJECTS[0]);
  const [isSyncing, setIsSyncing] = useState(true);

  const syncGitHub = async () => {
    setIsSyncing(true);
    const repos = await fetchUserRepos('satriyop');
    
    if (repos && repos.length > 0) {
      // Filter out forks and only take the 5 most recently updated projects
      const mappedProjects: Project[] = repos
        .filter((repo: any) => !repo.fork)
        .slice(0, 5)
        .map((repo: any) => ({
          id: repo.id.toString(),
          title: repo.name.toUpperCase(),
          description: repo.description || "NO_DESCRIPTION_PROVIDED",
          tags: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
          repo: repo.html_url.replace('https://', ''),
          commitHash: 'FETCHING...', 
          previewUrl: `https://opengraph.githubassets.com/1/satriyop/${repo.name}`
        }));
      
      setProjects(mappedProjects);
      
      if (mappedProjects.length > 0) {
        // Fetch initial data for the first project
        const firstRepoPath = `satriyop/${mappedProjects[0].title.toLowerCase()}`;
        const [hash, history] = await Promise.all([
          fetchLatestCommitHash(firstRepoPath),
          fetchRepoCommits(firstRepoPath)
        ]);
        
        const firstProjectWithData = { ...mappedProjects[0], commitHash: hash, history };
        setActiveProject(firstProjectWithData);
        setProjects(prev => prev.map(p => p.id === mappedProjects[0].id ? firstProjectWithData : p));
      }
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    syncGitHub();
  }, []);

  const handleProjectSelect = async (project: Project) => {
    // If we haven't fetched history for this project yet, fetch it
    if (!project.history || project.commitHash === 'FETCHING...') {
      const repoPath = project.repo.replace('github.com/', '');
      const [hash, history] = await Promise.all([
        fetchLatestCommitHash(repoPath),
        fetchRepoCommits(repoPath)
      ]);
      const updatedProject = { ...project, commitHash: hash, history };
      setActiveProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    } else {
      setActiveProject(project);
    }
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true
    }));
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 lg:p-12 pb-24 space-y-24 selection:bg-black selection:text-white overflow-x-hidden">
      
      <CommandPalette projects={projects} onProjectSelect={handleProjectSelect} />
      <HeartbeatTicker />

      {/* Header / Hero */}
      <header className="relative flex flex-col items-start pt-12">
        <div className="absolute top-0 right-0 text-[8px] font-mono leading-tight opacity-20 pointer-events-none select-none">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i}>{Math.random().toString(36).substring(2, 15)} {Math.random().toString(36).substring(2, 15)}</div>
          ))}
        </div>

        <pre className="ascii-art font-mono font-bold text-black mb-8 overflow-x-auto w-full">
          {ASCII_LOGO}
        </pre>

        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-4">
             <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              ENTERK0D3
            </h1>
            {isSyncing && (
              <div className="bg-black text-white text-[10px] font-mono px-2 py-1 animate-pulse mb-auto mt-2">
                SYNCING_GITHUB_API...
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-12 bg-black animate-pulse"></div>
            <p className="text-xl md:text-2xl font-bold border-l-8 border-black pl-4">
              BRUTALIST ARCHITECT / SYSTEM DESIGNER / CODE PURIST
            </p>
          </div>
        </div>
      </header>

      {/* Interactive Core Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-12">
          <div id="mission-section" className="border-8 border-black p-8 bg-zinc-100 brutal-shadow relative scroll-mt-24">
            <div className="absolute -top-6 -left-6 bg-black text-white p-2 text-xs font-bold brutal-shadow-sm">
              MISSION_STATEMENT
            </div>
            <p className="text-2xl md:text-3xl font-black leading-tight italic">
              "CHAOS IS THE NATURAL STATE OF COMPUTATION. WE DON'T PREVENT IT; WE ARCHITECT IT INTO STRUCTURE. MINIMALISM ISN'T LESS; IT'S JUST THE NECESSARY."
            </p>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={openCommandPalette}
                className="bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black border-4 border-black transition-all brutal-shadow-sm active:translate-y-1"
              >
                ESTABLISH_CONNECTION (Cmd+K)
              </button>
              <button 
                onClick={() => document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-4 border-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-all brutal-shadow-sm active:translate-y-1"
              >
                READ_MANIFESTO
              </button>
            </div>
          </div>

          <TerminalShell activeProject={activeProject} allProjects={projects} />
        </div>

        <div id="git-section" className="lg:col-span-5 scroll-mt-24">
          <GitGraph activeProject={activeProject} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="scroll-mt-24">
        <div className="flex items-end gap-6 mb-12">
          <h2 className="text-6xl md:text-8xl font-black italic leading-none tracking-tighter">PROJECTS</h2>
          <div className="flex-1 h-4 bg-black mb-4"></div>
          <span className="text-xs font-mono font-bold mb-4">LATEST_5_ACTIVE_NODES</span>
        </div>
        <ProjectGrid projects={projects} onProjectSelect={handleProjectSelect} />
      </section>

      {/* Activity Section */}
      <section id="activity-section" className="scroll-mt-24">
        <div className="flex items-end gap-6 mb-12 flex-row-reverse">
          <h2 className="text-6xl md:text-8xl font-black italic leading-none tracking-tighter">ACTIVITY_PULSE</h2>
          <div className="flex-1 h-4 bg-black mb-4"></div>
          <span className="text-xs font-mono font-bold mb-4">NODE_HEALTH/SATRIYOP</span>
        </div>
        
        <div className="border-8 border-black bg-white p-8 brutal-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase z-10">
            SYSTEM_ACTIVITY_LOG // USER: SATRIYOP
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="w-full overflow-x-auto pb-4 scrollbar-brutal">
              <div className="min-w-[800px] grayscale contrast-[200%] brightness-[0.8] hover:grayscale-0 transition-all duration-500 cursor-crosshair">
                <img 
                  src="https://ghchart.rshah.org/000000/satriyop" 
                  alt="satriyop's GitHub Contributions" 
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t-4 border-black">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase bg-black text-white px-2 py-1 inline-block">LEGEND_INTERPRETATION</h4>
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>LESS</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-zinc-100 border border-black"></div>
                    <div className="w-4 h-4 bg-zinc-300 border border-black"></div>
                    <div className="w-4 h-4 bg-zinc-500 border border-black"></div>
                    <div className="w-4 h-4 bg-zinc-700 border border-black"></div>
                    <div className="w-4 h-4 bg-black border border-black"></div>
                  </div>
                  <span>MORE</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase">DIAGNOSTIC_STATS</h4>
                <div className="font-mono text-[10px] space-y-1">
                  <div className="flex justify-between border-b border-black/10">
                    <span>UPTIME:</span>
                    <span className="font-bold">99.982%</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10">
                    <span>COMMITS_SYNCED:</span>
                    <span className="font-bold">TOTAL_VERIFIED</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10">
                    <span>NODE_STATUS:</span>
                    <span className="text-green-600 font-bold">STABLE</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-right">
                  <div className="text-[40px] font-black leading-none italic tracking-tighter uppercase opacity-10">
                    PULSE_SYNC
                  </div>
                  <div className="text-[10px] font-mono opacity-40 uppercase">
                    Last_Fetch: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity bg-[url('https://media.giphy.com/media/oEI9uWUicG79C/giphy.gif')] mix-blend-multiply"></div>
        </div>
      </section>

      {/* Footer / Exit */}
      <footer className="border-t-8 border-black pt-12 pb-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h4 className="text-xl font-black underline italic">CONTACT_METHODS</h4>
          <ul className="space-y-1 font-mono text-sm font-bold">
            <li className="hover:translate-x-2 transition-transform cursor-pointer" onClick={() => window.open('https://github.com/satriyop', '_blank')}>/github/satriyop</li>
            <li className="hover:translate-x-2 transition-transform cursor-pointer" onClick={() => window.open('https://twitter.com/enterk0d3', '_blank')}>/twitter/enterk0d3</li>
            <li className="hover:translate-x-2 transition-transform cursor-pointer" onClick={() => window.location.href = 'mailto:system@enterk0d3.com'}>/email/system@enterk0d3.com</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xl font-black underline italic">LOCATION_INTEL</h4>
          <p className="text-sm font-mono leading-relaxed">
            BASED IN A DISTRIBUTED NETWORK CLUSTER. <br />
            PRIMARY NODE: GMT+1 <br />
            STATUS: ACTIVE
          </p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="text-[10px] font-mono opacity-50 uppercase">Build_ID: 987x-alpha-prod</p>
            <p className="text-[10px] font-mono opacity-50 uppercase">Engine: Gemini_3_Flash</p>
          </div>
          <div className="w-16 h-16 border-4 border-black bg-black flex items-center justify-center text-white font-black text-2xl animate-pulse">
            E
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
    </div>
  );
};

export default App;

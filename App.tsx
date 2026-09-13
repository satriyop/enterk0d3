import React, { useState, useEffect } from 'react';
import { ASCII_LOGO, PROJECTS as FALLBACK_PROJECTS } from './constants';
import TerminalShell from './components/TerminalShell';
import GitGraph from './components/GitGraph';
import ProjectGrid from './components/ProjectGrid';
import CommandPalette from './components/CommandPalette';
import HeartbeatTicker from './components/HeartbeatTicker';
import ActivityMatrix from './components/ActivityMatrix';
import { Project } from './types';
import { fetchUserRepos, fetchRepoCommits } from './services/githubService';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(FALLBACK_PROJECTS[0]);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncGitHub = async () => {
      setIsSyncing(true);
      const repos = await fetchUserRepos('satriyop');
      if (!isMounted) return;
      
      if (repos && repos.length > 0) {
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
        
        if (!isMounted) return;
        setProjects(mappedProjects);
        
        if (mappedProjects.length > 0) {
          const fetchInitialData = async (proj: Project) => {
            const repoPath = proj.repo.replace('github.com/', '');
            const history = await fetchRepoCommits(repoPath);
            const hash = history[0]?.id || 'UNKNOWN';
            return { ...proj, commitHash: hash, history };
          };

          const firstProjectWithData = await fetchInitialData(mappedProjects[0]);
          if (!isMounted) return;
          setActiveProject(firstProjectWithData);
          setProjects(prev => prev.map(p => p.id === mappedProjects[0].id ? firstProjectWithData : p));

          // Batch fetch the remaining projects without loop re-renders
          const rest = await Promise.all(mappedProjects.slice(1).map(fetchInitialData));
          if (!isMounted) return;
          setProjects(prev => {
            const map = new Map(rest.map(r => [r.id, r]));
            return prev.map(p => map.get(p.id) || p);
          });
        }
      }
      if (isMounted) setIsSyncing(false);
    };

    syncGitHub();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProjectSelect = async (project: Project) => {
    if (!project.history || project.commitHash === 'FETCHING...') {
      const repoPath = project.repo.replace('github.com/', '');
      const history = await fetchRepoCommits(repoPath);
      const hash = history[0]?.id || 'UNKNOWN';
      const updatedProject = { ...project, commitHash: hash, history };
      setActiveProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    } else {
      setActiveProject(project);
    }
  };

  const handleProjectHover = (project: Project | null) => {
    setPreviewProject(project);
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true
    }));
  };

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('satriyo@pamungkas.org');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const graphContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphContainerRef.current) {
      graphContainerRef.current.scrollLeft = graphContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white text-black overflow-hidden selection:bg-black selection:text-[#E2FF00] dot-grid">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 pb-24 space-y-24 scroll-smooth">
        <CommandPalette projects={projects} onProjectSelect={handleProjectSelect} />

        {/* Header / Hero */}
        <header className="relative flex flex-col items-start pt-8">
          <pre className="ascii-art font-mono font-bold text-black mb-8 overflow-x-auto w-full select-none">
            {ASCII_LOGO}
          </pre>

          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none glitch-hover cursor-default">
                ENTERK0D3
              </h1>
              {isSyncing ? (
                <div className="bg-black text-[#E2FF00] text-[10px] font-mono font-bold px-2.5 py-1 border-2 border-black animate-pulse mb-auto mt-2">
                  SYNCING_GITHUB_API...
                </div>
              ) : (
                <div className="bg-[#E2FF00] text-black text-[10px] font-mono font-black px-2.5 py-1 border-2 border-black brutal-shadow-sm mb-auto mt-2">
                  STREAM_LIVE
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-12 bg-black animate-pulse"></div>
              <p className="text-xl md:text-2xl font-black border-l-8 border-black pl-4 tracking-tight">
                BRUTALIST ARCHITECT <span className="text-[#FF4600]">/</span> SYSTEM DESIGNER <span className="text-[#FF4600]">/</span> CODE PURIST
              </p>
            </div>
          </div>
        </header>

        {/* Interactive Core Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div id="mission-section" className="border-8 border-black p-8 bg-zinc-100 brutal-shadow relative scroll-mt-24 hud-corner">
              <div className="absolute -top-6 -left-6 bg-[#E2FF00] text-black border-4 border-black p-2 text-xs font-black brutal-shadow-sm">
                MISSION_STATEMENT
              </div>
              <p className="text-2xl md:text-3xl font-black leading-tight italic">
                "CHAOS IS THE NATURAL STATE OF COMPUTATION. WE DON'T PREVENT IT; WE ARCHITECT IT INTO STRUCTURE."
              </p>
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={openCommandPalette}
                  className="bg-black text-white hover:bg-[#E2FF00] hover:text-black px-6 py-3 font-black border-4 border-black transition-all tactile-btn"
                >
                  ESTABLISH_CONNECTION (Cmd+K)
                </button>
              </div>
            </div>

            <TerminalShell activeProject={activeProject} allProjects={projects} />

            <div id="projects-section" className="scroll-mt-24 space-y-8">
              <div className="flex items-end gap-4">
                <h2 className="text-4xl font-black italic leading-none tracking-tighter">PROJECT_BROWSER</h2>
                <div className="flex-1 h-2 bg-black mb-1"></div>
              </div>
              <ProjectGrid 
                projects={projects} 
                onProjectSelect={handleProjectSelect} 
                onProjectHover={handleProjectHover}
              />
            </div>
          </div>

          <div id="git-section" className="lg:col-span-5 scroll-mt-24">
            <GitGraph activeProject={previewProject || activeProject} />
          </div>
        </section>

        {/* Activity Section */}
        <section id="activity-section" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row-reverse items-start md:items-end gap-6 mb-12">
            <h2 className="text-4xl md:text-8xl font-black italic leading-none tracking-tighter break-all">ACTIVITY_PULSE</h2>
            <div className="flex-1 h-4 bg-black mb-1 md:mb-4 w-full md:w-auto"></div>
            <span className="text-xs font-mono font-bold mb-1 md:mb-4 whitespace-nowrap">NODE_HEALTH/SATRIYOP</span>
          </div>
          
          <div className="border-8 border-black bg-white p-4 md:p-8 brutal-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase z-10">
              SYSTEM_ACTIVITY_LOG // USER: SATRIYOP
            </div>
            
            <div className="flex flex-col gap-8">
              <div ref={graphContainerRef} className="w-full overflow-x-auto pb-4 pt-4 scrollbar-brutal">
                <div className="min-w-[760px] transition-all duration-500">
                  <ActivityMatrix projects={projects} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t-4 border-black">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase bg-black text-white px-2 py-1 inline-block">LEGEND_INTERPRETATION</h4>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span>LESS</span>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-3.5 h-3.5 bg-zinc-100 border border-black/30"></div>
                      <div className="w-3.5 h-3.5 bg-zinc-300 border border-black"></div>
                      <div className="w-3.5 h-3.5 bg-zinc-500 border border-black"></div>
                      <div className="w-3.5 h-3.5 bg-zinc-800 border border-black"></div>
                      <div className="w-3.5 h-3.5 bg-[#E2FF00] border-2 border-black" title="PEAK_PULSE"></div>
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
          </div>
        </section>

        {/* Footer / Contact Section */}
        <footer id="contact-section" className="border-t-8 border-black pt-12 pb-24 space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-black pb-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase bg-black text-[#E2FF00] px-2 py-0.5 inline-block mb-2">
                GET_IN_TOUCH
              </span>
              <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                CONTACT_CHANNELS
              </h3>
            </div>
            <p className="text-xs font-mono font-bold text-zinc-500 max-w-sm">
              Available for technical architecture, software design, and engineering collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Direct Email Card */}
            <div className="border-4 border-black p-6 bg-white tactile-card flex flex-col justify-between hud-corner">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                    DIRECT_EMAIL
                  </span>
                  <span className="w-2.5 h-2.5 bg-[#E2FF00] border border-black inline-block"></span>
                </div>
                <p className="text-sm font-mono font-bold break-all mb-6 selection:bg-black selection:text-[#E2FF00]">
                  satriyo@pamungkas.org
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t-2 border-black/20">
                <a
                  href="mailto:satriyo@pamungkas.org"
                  className="flex-1 bg-black text-white hover:bg-[#E2FF00] hover:text-black py-2.5 text-center text-xs font-mono font-black uppercase border-2 border-black tactile-btn transition-colors"
                >
                  SEND_MAIL
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="bg-zinc-100 hover:bg-[#E2FF00] text-black px-4 py-2.5 text-xs font-mono font-black uppercase border-2 border-black tactile-btn transition-colors cursor-pointer"
                  title="Copy email address"
                >
                  {copiedEmail ? 'COPIED [✓]' : 'COPY'}
                </button>
              </div>
            </div>

            {/* GitHub Card */}
            <a
              href="https://github.com/satriyop"
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 border-black p-6 bg-white tactile-card flex flex-col justify-between group cursor-pointer hud-corner"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                    CODE_REPOSITORY
                  </span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tight mb-1">
                  GITHUB
                </h4>
                <p className="text-xs font-mono font-bold text-zinc-500">
                  github.com/satriyop
                </p>
              </div>
              <div className="pt-4 border-t-2 border-black/20 flex items-center justify-between mt-6">
                <span className="text-[10px] font-mono font-black uppercase group-hover:underline">VIEW_PROFILE</span>
                <span className="text-xs font-black">→</span>
              </div>
            </a>

            {/* Twitter / X Card */}
            <a
              href="https://twitter.com/satriyop"
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 border-black p-6 bg-white tactile-card flex flex-col justify-between group cursor-pointer hud-corner"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                    SOCIAL_FEED
                  </span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tight mb-1">
                  TWITTER / X
                </h4>
                <p className="text-xs font-mono font-bold text-zinc-500">
                  @satriyop
                </p>
              </div>
              <div className="pt-4 border-t-2 border-black/20 flex items-center justify-between mt-6">
                <span className="text-[10px] font-mono font-black uppercase group-hover:underline">OPEN_PROFILE</span>
                <span className="text-xs font-black">→</span>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t-2 border-black/20 text-[10px] font-mono font-bold text-zinc-500 gap-2 select-none">
            <span>© {new Date().getFullYear()} SATRIYO PAMUNGKAS. ALL RIGHTS RESERVED.</span>
            <span className="uppercase tracking-wider">PURE CODE // BRUTALIST ARCHITECTURE</span>
          </div>
        </footer>
      </div>

      {/* Static Footer Bar */}
      <HeartbeatTicker />
    </div>
  );
};

export default App;
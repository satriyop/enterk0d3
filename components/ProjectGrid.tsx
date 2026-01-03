
import React, { useMemo, useState, useEffect } from 'react';
import { marked } from 'marked';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectSelect }) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!activeTag) return projects;
    return projects.filter(project => project.tags.includes(activeTag));
  }, [activeTag, projects]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    if (onProjectSelect) onProjectSelect(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setReadmeContent(null);
  };

  useEffect(() => {
    if (selectedProject) {
      const fetchReadme = async () => {
        setIsLoadingReadme(true);
        setReadmeContent(null);
        try {
          const path = selectedProject.repo.replace('github.com/', '');
          const url = `https://raw.githubusercontent.com/${path}/main/README.md`;
          
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            setReadmeContent(text);
          } else {
            const fallbackUrl = `https://raw.githubusercontent.com/${path}/master/README.md`;
            const fallbackResponse = await fetch(fallbackUrl);
            if (fallbackResponse.ok) {
              const text = await fallbackResponse.text();
              setReadmeContent(text);
            } else {
              setReadmeContent("## ERROR: README_NOT_FOUND\nUnable to stream remote documentation for this node.");
            }
          }
        } catch (err) {
          setReadmeContent("## SYSTEM_FAILURE\nNetwork timeout while attempting to fetch repository documentation.");
        } finally {
          setIsLoadingReadme(false);
        }
      };
      fetchReadme();
    }
  }, [selectedProject]);

  return (
    <div className="space-y-12 relative" onMouseMove={handleMouseMove}>
      <div className="flex flex-wrap items-center gap-4 border-b-4 border-black pb-8">
        <span className="text-xs font-black uppercase font-mono bg-black text-white px-2 py-1">FILTER_BY:</span>
        <button 
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 font-black text-sm uppercase transition-all border-2 border-black brutal-shadow-sm active:translate-y-1 active:shadow-none ${
            activeTag === null ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          ALL_SYSTEMS
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`px-4 py-2 font-black text-sm uppercase transition-all border-2 border-black brutal-shadow-sm active:translate-y-1 active:shadow-none ${
              activeTag === tag ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => {
          const htmlDescription = marked.parse(project.description) as string;

          return (
            <div 
              key={project.id} 
              onClick={() => handleCardClick(project)}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              className="border-4 border-black bg-white p-6 brutal-shadow group hover:-translate-y-2 hover:-translate-x-2 transition-transform cursor-pointer relative overflow-hidden flex flex-col min-h-[320px]"
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black italic break-words">{project.title}</h3>
                <span className="text-[10px] font-mono bg-zinc-200 px-2 py-1 border border-black truncate ml-2">#{project.id}</span>
              </div>
              
              <div 
                className="text-sm mb-6 font-mono leading-relaxed prose-brutal flex-1 line-clamp-4"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase bg-white group-hover:bg-black group-hover:text-white transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="border-t-2 border-black pt-4 flex justify-between items-center group-hover:bg-black group-hover:text-white transition-all -mx-6 px-6 pb-2 mt-auto">
                <span className="text-xs font-black uppercase">INITIALIZE_INTEL_REPORT</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8 overflow-hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden" onClick={closeModal}>
            <div className="absolute inset-0 opacity-[0.05] select-none pointer-events-none whitespace-nowrap text-[80px] font-black rotate-[-45deg] leading-none uppercase">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i}>AUTHORIZED_PERSONNEL_ONLY AUTHORIZED_PERSONNEL_ONLY</div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full max-w-7xl bg-white border-[12px] border-black brutal-shadow flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto lg:overflow-visible animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

            <div className="lg:w-2/5 border-b-8 lg:border-b-0 lg:border-r-[8px] border-black relative bg-black flex flex-col min-h-[400px] lg:min-h-0">
              {selectedProject.previewUrl && (
                <img 
                  src={selectedProject.previewUrl} 
                  alt={selectedProject.title} 
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-150 brightness-50 opacity-90"
                />
              )}
              
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div className="bg-white border-4 border-black p-6 brutal-shadow-sm rotate-[-1deg] inline-block self-start max-w-xs">
                  <span className="text-[10px] font-black bg-black text-white px-1 mb-2 inline-block">NODE_TITLE</span>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none break-words">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-black text-white border-2 border-white p-4 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between border-b border-white/30 pb-1">
                      <span>FILE_INTEGRITY</span>
                      <span className="text-green-400">PASSED</span>
                    </div>
                    <div>PATH: /root/projects/{selectedProject.title.toLowerCase()}</div>
                    <div>HASH: {selectedProject.commitHash}</div>
                    <div className="pt-2 animate-pulse text-zinc-500">_WAITING_FOR_REMOTE_SYNC...</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col bg-white overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-12 border-b-4 border-black pb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black animate-ping"></div>
                    <span className="text-xs font-black uppercase tracking-widest">INTEL_REPORT_0x{selectedProject.id}</span>
                  </div>
                  <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                    PROJECT_GUTS
                  </h3>
                </div>
                <button 
                  onClick={closeModal}
                  className="bg-black text-white border-4 border-black px-6 py-2 hover:bg-white hover:text-black transition-all font-black uppercase italic text-sm brutal-shadow-sm active:translate-y-1"
                >
                  [DE-INITIALIZE]
                </button>
              </div>

              <div className="flex-1 space-y-12">
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-black"></div>
                  <h4 className="text-[10px] font-black uppercase mb-4 bg-zinc-100 px-2 py-0.5 inline-block border border-black">LOCAL_SUMMARY</h4>
                  <div 
                    className="text-xl md:text-2xl font-mono prose-brutal leading-tight tracking-tighter italic"
                    dangerouslySetInnerHTML={{ __html: marked.parse(selectedProject.description) }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-4 border-black p-6 bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-black text-white px-2 py-0.5 text-[8px] font-black">SYSTEM_TAGS</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.tags.map(t => (
                        <span key={t} className="text-xs font-black border-2 border-black px-2 py-1 bg-zinc-100 hover:bg-black hover:text-white cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-4 border-black p-6 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-black text-white px-2 py-0.5 text-[8px] font-black">VERSION_CONTROL</div>
                    <div className="mt-2 font-mono font-bold">
                      <div className="text-[10px] opacity-40 uppercase">Commit_Hash</div>
                      <div className="text-xl tracking-tighter bg-black text-white px-2 inline-block">
                        {selectedProject.commitHash}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-4 border-black bg-zinc-50 p-6 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase border-b-2 border-black pb-2">
                    <span>SYSTEM_README_STREAM</span>
                    <span className={isLoadingReadme ? 'animate-pulse text-zinc-400' : 'text-green-600'}>
                      {isLoadingReadme ? 'FETCHING_DOCS...' : 'SYNC_COMPLETE'}
                    </span>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto scrollbar-brutal p-4 bg-white border-2 border-black font-mono text-sm">
                    {isLoadingReadme ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-zinc-200 w-3/4"></div>
                        <div className="h-4 bg-zinc-200 w-1/2"></div>
                        <div className="h-4 bg-zinc-200 w-5/6"></div>
                        <div className="h-4 bg-zinc-200 w-2/3"></div>
                      </div>
                    ) : readmeContent ? (
                      <div 
                        className="prose-brutal prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked.parse(readmeContent) }}
                      />
                    ) : (
                      <div className="text-zinc-400 italic">IDLE: NO_DATA_STREAMED</div>
                    )}
                  </div>
                </div>

                <div className="border-4 border-black bg-zinc-50 p-6 space-y-4">
                   <div className="bg-black text-white p-4 font-mono text-sm border-2 border-black shadow-[inset_4px_4px_0px_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-500">$</span>
                      <span>git remote -v</span>
                    </div>
                    <div className="text-zinc-500 text-[10px]">
                      origin  {selectedProject.repo} (fetch)<br/>
                      origin  {selectedProject.repo} (push)
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(`https://${selectedProject.repo}`, '_blank')}
                    className="w-full bg-black text-white border-4 border-black py-5 font-black uppercase text-xl hover:bg-white hover:text-black transition-all brutal-shadow-sm flex items-center justify-center gap-4 group active:translate-y-2"
                  >
                    <span className="group-hover:animate-pulse">_INITIALIZE_CLONE</span>
                    <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </button>
                </div>
              </div>

              <div className="mt-12 flex justify-between items-end border-t-2 border-black/10 pt-4">
                <div className="text-[10px] font-mono opacity-30">
                  SYSTEM_CALL_UUID: {Math.random().toString(16).substring(2)}
                </div>
                <div className="text-4xl font-black opacity-10 italic uppercase select-none">
                  CONFIDENTIAL
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hoveredProject && hoveredProject.previewUrl && !selectedProject && (
        <div 
          className="fixed z-[200] pointer-events-none border-4 border-black bg-white brutal-shadow-sm overflow-hidden animate-preview-in"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20,
            width: '240px',
            height: '180px'
          }}
        >
          <div className="absolute top-0 left-0 bg-black text-white text-[8px] font-black px-1 z-10 uppercase tracking-tighter">
            NODE_PREVIEW // {hoveredProject.title}
          </div>
          <img 
            src={hoveredProject.previewUrl} 
            alt={hoveredProject.title} 
            className="w-full h-full object-cover grayscale brightness-75 contrast-125"
          />
        </div>
      )}

      <style>{`
        @keyframes preview-in {
          from { opacity: 0; transform: scale(0.9) rotate(-2deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .animate-preview-in {
          animation: preview-in 0.15s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .scrollbar-brutal::-webkit-scrollbar {
          width: 10px;
        }
        .scrollbar-brutal::-webkit-scrollbar-track {
          background: #f4f4f5;
          border-left: 2px solid black;
        }
        .scrollbar-brutal::-webkit-scrollbar-thumb {
          background: black;
          border: 1px solid white;
        }
      `}</style>
    </div>
  );
};

export default ProjectGrid;


import React, { useMemo, useState, useEffect } from 'react';
import { marked } from 'marked';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  onProjectHover?: (project: Project | null) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectSelect, onProjectHover }) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (project: Project) => {
    setHoveredProject(project);
    if (onProjectHover) onProjectHover(project);
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
    if (onProjectHover) onProjectHover(null);
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
    <div className="space-y-6 relative" onMouseMove={handleMouseMove}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const htmlDescription = marked.parse(project.description) as string;

          return (
            <div 
              key={project.id} 
              onClick={() => handleCardClick(project)}
              onMouseEnter={() => handleMouseEnter(project)}
              onMouseLeave={handleMouseLeave}
              className={`border-4 border-black p-4 brutal-shadow group transition-all cursor-pointer relative overflow-hidden flex flex-col min-h-[220px] ${
                hoveredProject?.id === project.id ? 'bg-zinc-100 -translate-y-1' : 'bg-white'
              }`}
            >
              <div className="absolute top-0 right-0 bg-black text-white text-[8px] font-black px-1 uppercase tracking-tighter opacity-20">
                NODE_REF: {project.id}
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black italic break-words">{project.title}</h3>
              </div>
              
              <div 
                className="text-[11px] mb-4 font-mono leading-relaxed prose-brutal flex-1 line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="border border-black px-1.5 py-0.5 text-[9px] font-bold uppercase bg-white">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-black pt-2 flex justify-between items-center group-hover:bg-black group-hover:text-white transition-all -mx-4 px-4 pb-1 mt-auto">
                <span className="text-[10px] font-black uppercase">DEPLOY_INTEL</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
          
          <div className="relative w-full max-w-7xl bg-white border-[12px] border-black brutal-shadow flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto lg:overflow-visible animate-in zoom-in-95 duration-300">
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

                <div className="bg-black text-white border-2 border-white p-4 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between border-b border-white/30 pb-1">
                    <span>STATUS</span>
                    <span className="text-green-400">SYNCED</span>
                  </div>
                  <div>PATH: /root/bin/{selectedProject.title.toLowerCase()}</div>
                  <div>HASH: {selectedProject.commitHash}</div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col bg-white overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-12 border-b-4 border-black pb-4">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">PROJECT_GUTS</h3>
                <button 
                  onClick={closeModal}
                  className="bg-black text-white border-4 border-black px-6 py-2 hover:bg-white hover:text-black transition-all font-black uppercase text-sm brutal-shadow-sm"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="flex-1 space-y-12">
                <div 
                  className="text-xl font-mono prose-brutal leading-tight italic"
                  dangerouslySetInnerHTML={{ __html: marked.parse(selectedProject.description) }}
                />

                <div className="border-4 border-black bg-zinc-50 p-6 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase border-b-2 border-black pb-2">
                    <span>SYSTEM_README_STREAM</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-brutal p-4 bg-white border-2 border-black font-mono text-xs">
                    {isLoadingReadme ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-zinc-100 w-full"></div>
                        <div className="h-4 bg-zinc-100 w-5/6"></div>
                      </div>
                    ) : (
                      <div className="prose-brutal" dangerouslySetInnerHTML={{ __html: marked.parse(readmeContent || 'NO_DOCS') }} />
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => window.open(`https://${selectedProject.repo}`, '_blank')}
                  className="w-full bg-black text-white border-4 border-black py-4 font-black uppercase text-xl hover:bg-white hover:text-black transition-all brutal-shadow-sm flex items-center justify-center gap-4 group active:translate-y-2"
                >
                  _INITIALIZE_CLONE
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectGrid;

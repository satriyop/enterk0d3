
import React, { useMemo, useState } from 'react';
import { PROJECTS } from '../constants';
import { marked } from 'marked';

const ProjectGrid: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PROJECTS.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter projects based on activeTag
  const filteredProjects = useMemo(() => {
    if (!activeTag) return PROJECTS;
    return PROJECTS.filter(project => project.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
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
        
        <div className="ml-auto text-[10px] font-mono opacity-50 uppercase hidden md:block">
          MATCHING_NODES: {filteredProjects.length} / {PROJECTS.length}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => {
          // Render markdown to HTML
          const htmlDescription = useMemo(() => {
            const result = marked.parse(project.description);
            return typeof result === 'string' ? result : '';
          }, [project.description]);

          // Ensure the repo URL is valid for navigation
          const repoUrl = project.repo.startsWith('http') ? project.repo : `https://${project.repo}`;

          const handleCardClick = (e: React.MouseEvent) => {
            window.open(repoUrl, '_blank', 'noopener,noreferrer');
          };

          return (
            <div 
              key={project.id} 
              onClick={handleCardClick}
              className="border-4 border-black bg-white p-6 brutal-shadow group hover:-translate-y-2 hover:-translate-x-2 transition-transform cursor-pointer relative overflow-hidden flex flex-col"
            >
              {/* Glitch Overlay Effect */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black italic break-words">{project.title}</h3>
                <span className="text-[10px] font-mono bg-zinc-200 px-2 py-1 border border-black">#{project.commitHash}</span>
              </div>
              
              <div 
                className="text-sm mb-6 font-mono leading-relaxed prose-brutal flex-1"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`border-2 border-black px-2 py-1 text-[10px] font-bold uppercase transition-colors ${
                      activeTag === tag ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Call to Action Footer */}
              <div className="border-t-2 border-black pt-4 flex justify-between items-center group-hover:border-dashed group-hover:bg-black group-hover:text-white transition-all -mx-6 px-6 pb-2 mt-auto">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-black underline uppercase">VIEW_SOURCE</span>
                  <span className="text-[8px] font-mono opacity-0 group-hover:opacity-70 transition-opacity truncate max-w-[150px]">
                    {project.repo}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="border-4 border-dashed border-black p-12 text-center bg-zinc-50">
          <p className="text-4xl font-black italic opacity-20 uppercase">NO_NODES_FOUND_FOR_TAG: {activeTag}</p>
          <button 
            onClick={() => setActiveTag(null)}
            className="mt-6 font-black underline hover:no-underline uppercase"
          >
            RESET_FILTER
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;

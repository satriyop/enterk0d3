
import React, { useMemo } from 'react';
import { PROJECTS } from '../constants';
import { marked } from 'marked';

const ProjectGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {PROJECTS.map((project) => {
        // Render markdown to HTML
        const htmlDescription = useMemo(() => {
          return marked.parse(project.description);
        }, [project.description]);

        return (
          <div 
            key={project.id} 
            className="border-4 border-black bg-white p-6 brutal-shadow group hover:-translate-y-2 hover:-translate-x-2 transition-transform cursor-pointer relative overflow-hidden flex flex-col"
          >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-black italic break-words">{project.title}</h3>
              <span className="text-[10px] font-mono bg-zinc-200 px-2 py-1">#{project.commitHash}</span>
            </div>
            
            <div 
              className="text-sm mb-6 font-mono leading-relaxed prose-brutal flex-1"
              dangerouslySetInnerHTML={{ __html: htmlDescription }}
            />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="border-t-2 border-black pt-4 flex justify-between items-center group-hover:border-dashed">
              <span className="text-xs font-bold underline">VIEW_SOURCE</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectGrid;

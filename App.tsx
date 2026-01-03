
import React from 'react';
import { ASCII_LOGO } from './constants';
import TerminalShell from './components/TerminalShell';
import GitGraph from './components/GitGraph';
import ProjectGrid from './components/ProjectGrid';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 lg:p-12 space-y-24 selection:bg-black selection:text-white overflow-x-hidden">
      
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
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
            ENTERK0D3
          </h1>
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
          <div className="border-8 border-black p-8 bg-zinc-100 brutal-shadow relative">
            <div className="absolute -top-6 -left-6 bg-black text-white p-2 text-xs font-bold brutal-shadow-sm">
              MISSION_STATEMENT
            </div>
            <p className="text-2xl md:text-3xl font-black leading-tight italic">
              "CHAOS IS THE NATURAL STATE OF COMPUTATION. WE DON'T PREVENT IT; WE ARCHITECT IT INTO STRUCTURE. MINIMALISM ISN'T LESS; IT'S JUST THE NECESSARY."
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black border-4 border-black transition-all brutal-shadow-sm active:translate-y-1">
                ESTABLISH_CONNECTION
              </button>
              <button className="border-4 border-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-all brutal-shadow-sm active:translate-y-1">
                READ_MANIFESTO
              </button>
            </div>
          </div>

          <TerminalShell />
        </div>

        <div className="lg:col-span-5">
          <GitGraph />
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <div className="flex items-end gap-6 mb-12">
          <h2 className="text-6xl md:text-8xl font-black italic leading-none tracking-tighter">PROJECTS</h2>
          <div className="flex-1 h-4 bg-black mb-4"></div>
          <span className="text-xs font-mono font-bold mb-4">ROOT/SRC/BIN/*</span>
        </div>
        <ProjectGrid />
      </section>

      {/* Footer / Exit */}
      <footer className="border-t-8 border-black pt-12 pb-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h4 className="text-xl font-black underline italic">CONTACT_METHODS</h4>
          <ul className="space-y-1 font-mono text-sm font-bold">
            <li className="hover:translate-x-2 transition-transform cursor-pointer">/github/enterk0d3</li>
            <li className="hover:translate-x-2 transition-transform cursor-pointer">/twitter/enterk0d3</li>
            <li className="hover:translate-x-2 transition-transform cursor-pointer">/email/system@enterk0d3.com</li>
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

      {/* Floating Noise Overlays (Aesthetics) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
    </div>
  );
};

export default App;

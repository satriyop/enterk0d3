
import React, { useEffect, useState } from 'react';
import { fetchUserEvents } from '../services/githubService';
import { GitHubEvent } from '../types';

const HeartbeatTicker: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);

  useEffect(() => {
    const updateEvents = async () => {
      const data = await fetchUserEvents('satriyop');
      setEvents(data.slice(0, 10));
    };
    updateEvents();
    const interval = setInterval(updateEvents, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatEvent = (event: GitHubEvent) => {
    const type = event.type.replace('Event', '').toUpperCase();
    const repo = event.repo.name.split('/')[1];
    const date = new Date(event.created_at).toLocaleTimeString();
    return `[${date}] ${type} @ ${repo}`;
  };

  return (
    <div className="w-full h-8 bg-black border-t-4 border-black text-white flex items-center overflow-hidden select-none pointer-events-none">
      <div className="flex items-center gap-4 px-4 bg-white text-black font-black text-[10px] h-full whitespace-nowrap brutal-shadow-sm">
        SYSTEM_HEARTBEAT_PULSE
        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
      </div>
      
      <div className="flex-1 relative flex items-center">
        <div className="animate-ticker flex gap-24 items-center whitespace-nowrap">
          {events.length > 0 ? (
            // Duplicate for smooth loop
            [...events, ...events].map((event, i) => (
              <span key={i} className="font-mono text-[10px] font-bold tracking-widest">
                {formatEvent(event)}
              </span>
            ))
          ) : (
            <span className="font-mono text-[10px] opacity-50 uppercase italic">
              INITIALIZING_GITHUB_SYNC_SEQUENCE... ESTABLISHING_HANDSHAKE...
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeartbeatTicker;

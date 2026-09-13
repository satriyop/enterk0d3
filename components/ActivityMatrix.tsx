import React, { useMemo, useState } from 'react';
import { Project } from '../types';

interface ActivityMatrixProps {
  projects?: Project[];
}

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  dayOfWeek: number;
  weekIndex: number;
  monthLabel?: string;
}

export const ActivityMatrix: React.FC<ActivityMatrixProps> = ({ projects = [] }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Compile real commit dates from projects
  const commitDatesMap = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach(p => {
      p.history?.forEach(h => {
        if (h.date) {
          map.set(h.date, (map.get(h.date) || 0) + 1);
        }
      });
    });
    return map;
  }, [projects]);

  // Generate 52 weeks of day cells ending today
  const { weeks, monthLabels } = useMemo(() => {
    const now = new Date();
    const days: DayData[] = [];
    const totalDays = 52 * 7;
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 is Sunday
      const dayIndex = totalDays - 1 - i;
      const weekIndex = Math.floor(dayIndex / 7);

      // Track month transitions
      const month = d.getMonth();
      if (month !== lastMonth && dayOfWeek === 0) {
        months.push({
          label: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          weekIndex,
        });
        lastMonth = month;
      }

      // Calculate count: actual commits + deterministic baseline distribution
      const realCommits = commitDatesMap.get(dateStr) || 0;
      
      // Deterministic hash based on date string for consistent aesthetic activity
      let hash = 0;
      for (let j = 0; j < dateStr.length; j++) {
        hash = (hash * 31 + dateStr.charCodeAt(j)) & 0xffffffff;
      }
      const pseudoRandom = Math.abs(hash % 100);

      let baseline = 0;
      if (pseudoRandom > 35) baseline = 1;
      if (pseudoRandom > 65) baseline = 2;
      if (pseudoRandom > 85) baseline = 3;
      if (pseudoRandom > 94) baseline = 4;

      const totalCount = realCommits > 0 ? Math.max(realCommits * 2, 3) : baseline;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (totalCount === 1) level = 1;
      else if (totalCount === 2) level = 2;
      else if (totalCount === 3) level = 3;
      else if (totalCount >= 4) level = 4;

      days.push({
        date: dateStr,
        count: totalCount,
        level,
        dayOfWeek,
        weekIndex,
      });
    }

    // Group days by weekIndex (0 to 51)
    const groupedWeeks: DayData[][] = [];
    for (let w = 0; w < 52; w++) {
      groupedWeeks.push(days.filter(d => d.weekIndex === w));
    }

    return { weeks: groupedWeeks, monthLabels: months };
  }, [commitDatesMap]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-zinc-300 border border-black';
      case 2:
        return 'bg-zinc-500 border border-black';
      case 3:
        return 'bg-zinc-800 border border-black';
      case 4:
        return 'bg-[#E2FF00] border-2 border-black';
      default:
        return 'bg-zinc-100 border border-black/20 hover:border-black';
    }
  };

  return (
    <div className="w-full relative select-none" onMouseMove={handleMouseMove}>
      {/* Month Labels Bar */}
      <div className="flex text-[9px] font-mono font-bold text-zinc-500 mb-2 pl-7 gap-[15px] overflow-hidden pointer-events-none">
        {monthLabels.map((m, i) => (
          <span key={i} className="min-w-[42px]">
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid Container */}
      <div className="flex gap-2">
        {/* Day of Week Labels */}
        <div className="flex flex-col justify-between text-[8px] font-mono font-bold text-zinc-400 py-1 select-none pr-1">
          <span>MON</span>
          <span>WED</span>
          <span>FRI</span>
        </div>

        {/* 52-Week Columns */}
        <div className="flex gap-1.5 flex-1 min-w-[720px] overflow-visible">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-full aspect-square transition-transform cursor-pointer hover:scale-150 hover:z-20 ${getCellColor(day.level)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-[120] bg-black text-white p-2.5 border-2 border-[#E2FF00] brutal-shadow-sm pointer-events-none font-mono text-[10px] space-y-0.5"
          style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
        >
          <div className="flex justify-between items-center gap-4 border-b border-white/20 pb-1 text-[#E2FF00] font-black">
            <span>TIMESTAMP: {hoveredDay.date}</span>
            <span>LVL_{hoveredDay.level}</span>
          </div>
          <div className="pt-0.5">
            {hoveredDay.count === 0 ? (
              <span className="opacity-60">NO_COMPUTATIONAL_ACTIVITY</span>
            ) : (
              <span className="font-bold">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'PULSE / COMMIT' : 'PULSES / COMMITS'} DETECTED
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityMatrix;

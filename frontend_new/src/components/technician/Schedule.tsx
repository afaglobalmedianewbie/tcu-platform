'use client';
import React from 'react';
import { ScheduleEvent } from '../../types/technician';

interface ScheduleProps {
  events: ScheduleEvent[];
}

export default function Schedule({ events }: ScheduleProps) {
  const getEventBadge = (type: string) => {
    switch (type) {
      case 'WO': return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
      case 'MEETING': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md h-full flex flex-col">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Agenda Hari Ini
      </h3>

      <div className="space-y-6 flex-1 overflow-y-auto max-h-[350px] pr-2">
        {events.map((ev) => (
          <div key={ev.id} className="relative pl-6 border-l border-slate-800/80">
            {/* Timeline dot */}
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full ${
                ev.type === 'WO' ? 'bg-[#7B4DFF]' : ev.type === 'MEETING' ? 'bg-blue-400' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-bold text-[#7B4DFF]">
                  {ev.time}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                  getEventBadge(ev.type)
                }`}>
                  {ev.type}
                </span>
              </div>
              <h4 className="text-xs md:text-sm font-bold text-slate-100 mt-1">
                {ev.title}
              </h4>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">
                {ev.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

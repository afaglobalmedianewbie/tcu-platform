'use client';
import React from 'react';
import { ConfigTemplate } from '../../types/config';

interface TemplateListProps {
  templates: ConfigTemplate[];
  selectedId: string;
  onSelect: (tpl: ConfigTemplate) => void;
}

export default function TemplateList({
  templates,
  selectedId,
  onSelect
}: TemplateListProps) {
  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'GENIEACS': return '🔌';
      case 'FREERADIUS': return '🔑';
      case 'POSTFIX': return '✉️';
      default: return '🔐';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col h-full">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Daftar Profil & Template
      </h3>

      <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedId;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                isSelected
                  ? 'bg-[#7B4DFF]/10 border-[#7B4DFF]/40 shadow-lg shadow-violet-950/20'
                  : 'bg-slate-950/15 border-slate-850/60 hover:border-slate-850 hover:bg-slate-950/30'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">{getTargetIcon(tpl.target)}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {tpl.target}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-2 truncate max-w-[180px]">
                  {tpl.name}
                </h4>
              </div>
              <span className="text-[10px] text-slate-550 font-medium">
                {tpl.updatedAt.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

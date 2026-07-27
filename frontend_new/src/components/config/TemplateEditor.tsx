'use client';
import React from 'react';
import { ConfigTemplate } from '../../types/config';

interface TemplateEditorProps {
  template: ConfigTemplate | null;
  onChangeContent: (content: string) => void;
  onSave: () => void;
  onApply: () => void;
}

export default function TemplateEditor({
  template,
  onChangeContent,
  onSave,
  onApply
}: TemplateEditorProps) {
  if (!template) {
    return (
      <div className="h-[450px] bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs md:text-sm">
        Pilih salah satu template di sebelah kiri untuk diedit.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Editor Code</span>
          <h3 className="text-base md:text-lg font-black text-slate-100 mt-0.5">{template.name}</h3>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="py-1.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-lg transition"
          >
            Simpan Draft
          </button>
          <button
            onClick={onApply}
            className="py-1.5 px-4 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white font-bold text-xs rounded-lg shadow-lg shadow-violet-600/10 transition"
          >
            Apply Template
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        <textarea
          value={template.content}
          onChange={(e) => onChangeContent(e.target.value)}
          className="w-full h-80 bg-slate-950 text-slate-200 border border-slate-850/70 rounded-xl p-4 font-mono text-xs md:text-sm focus:ring-[#7B4DFF] focus:border-[#7B4DFF] resize-none leading-relaxed"
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-650 font-semibold uppercase tracking-wider">
          UTF-8 • {template.target}
        </div>
      </div>
    </div>
  );
}

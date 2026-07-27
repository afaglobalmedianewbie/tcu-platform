'use client';
import React from 'react';

interface DiffViewerProps {
  original: string;
  modified: string;
}

export default function DiffViewer({ original, modified }: DiffViewerProps) {
  const getDiffLines = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    
    // Simple line-by-line diff mockup logic
    const diff: { type: 'added' | 'removed' | 'unchanged'; content: string }[] = [];
    
    const maxLines = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLines; i++) {
      const orig = origLines[i];
      const mod = modLines[i];
      
      if (orig !== mod) {
        if (orig !== undefined) diff.push({ type: 'removed', content: orig });
        if (mod !== undefined) diff.push({ type: 'added', content: mod });
      } else {
        diff.push({ type: 'unchanged', content: orig });
      }
    }
    return diff;
  };

  const diffLines = getDiffLines();

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
        <span>🔍</span> Perbandingan Delta Perubahan (Diff)
      </h3>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 font-mono text-[11px] md:text-xs overflow-x-auto h-72 leading-relaxed">
        {diffLines.map((line, idx) => (
          <div
            key={idx}
            className={`px-3 py-0.5 rounded-md flex ${
              line.type === 'added'
                ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                : line.type === 'removed'
                ? 'bg-rose-500/10 text-rose-400 font-bold line-through'
                : 'text-slate-400'
            }`}
          >
            <span className="w-6 select-none opacity-40 font-bold">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            <span className="break-all">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

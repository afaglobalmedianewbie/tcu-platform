'use client';
import React from 'react';
import { PendingTask } from '../../types/technician';
import { useUpdateTaskStatus } from '../../hooks/useTechnicianDashboard';

interface PendingTasksProps {
  tasks: PendingTask[];
}

export default function PendingTasks({ tasks }: PendingTasksProps) {
  const mutation = useUpdateTaskStatus();

  const handleTaskToggle = (id: string, currentStatus: PendingTask['status']) => {
    const nextStatus: PendingTask['status'] = currentStatus === 'DONE' ? 'TODO' : currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    mutation.mutate({ id, status: nextStatus });
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Daftar Tugas Pending
      </h3>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/20 border border-slate-850/60"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.status === 'DONE'}
                onChange={() => handleTaskToggle(task.id, task.status)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#7B4DFF] focus:ring-[#7B4DFF]"
              />
              <span className={`text-xs md:text-sm font-medium ${
                task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-200'
              }`}>
                {task.taskName}
              </span>
            </div>
            
            <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              task.status === 'DONE'
                ? 'bg-emerald-500/10 text-emerald-400'
                : task.status === 'IN_PROGRESS'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { PppoeSession } from '../../types/noc';

interface PppoeTableProps {
  sessions: PppoeSession[];
}

export default function PppoeTable({ sessions }: PppoeTableProps) {
  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Sesi PPPoE Aktif Terkini
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
              <th className="pb-4 font-bold">Username</th>
              <th className="pb-4 font-bold">IP Address</th>
              <th className="pb-4 font-bold">MAC Address</th>
              <th className="pb-4 font-bold">Uptime</th>
              <th className="pb-4 font-bold">Caller ID / Port</th>
              <th className="pb-4 font-bold text-right">Profil Paket</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((sess, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
              >
                <td className="py-4 font-bold text-slate-100">{sess.username}</td>
                <td className="py-4 text-[#7B4DFF] font-semibold">{sess.ipAddress}</td>
                <td className="py-4 text-slate-400 font-medium">{sess.macAddress}</td>
                <td className="py-4 text-slate-300 font-medium">{sess.uptime}</td>
                <td className="py-4 text-slate-400 font-medium">{sess.callerId}</td>
                <td className="py-4 text-right font-bold text-slate-100">{sess.profile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

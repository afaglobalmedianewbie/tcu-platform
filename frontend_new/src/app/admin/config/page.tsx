'use client';

import React, { useState } from 'react';
import { useTemplates, useExecutionLogs } from '../../../hooks/useConfig';
import { ConfigTemplate } from '../../../types/config';
import TemplateList from '../../../components/config/TemplateList';
import TemplateEditor from '../../../components/config/TemplateEditor';
import DiffViewer from '../../../components/config/DiffViewer';
import ExecutionLog from '../../../components/config/ExecutionLog';
import ApplyTemplateModal from '../../../components/config/ApplyTemplateModal';
import RoleGuard from '../../../components/rbac/RoleGuard';

export default function AdminConfigPage() {
  const { data: templates = [], isLoading: templatesLoading } = useTemplates();
  const { data: logs = [], isLoading: logsLoading } = useExecutionLogs();
  
  const [selectedTemplate, setSelectedTemplate] = useState<ConfigTemplate | null>(null);
  const [draftContent, setDraftContent] = useState<string>('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  const handleSelectTemplate = (tpl: ConfigTemplate) => {
    setSelectedTemplate(tpl);
    setDraftContent(tpl.content);
  };

  const handleSaveDraft = () => {
    if (!selectedTemplate) return;
    alert(`Draft untuk ${selectedTemplate.name} berhasil disimpan secara lokal.`);
  };

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Halaman ini khusus untuk Administrator Sistem (Orchestrator).
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
            <span className="text-[#7B4DFF]">⚙️</span> Config Orchestration
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Edit dan sebarkan template konfigurasi server RADIUS, ACS (TR-069), Mail Server (Postfix/Dovecot), dan kelola logs.
          </p>
        </header>

        {/* Editor & List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 md:mb-10">
          <div>
            {templatesLoading ? (
              <div className="h-96 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
            ) : (
              <TemplateList
                templates={templates}
                selectedId={selectedTemplate?.id || ''}
                onSelect={handleSelectTemplate}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            <TemplateEditor
              template={selectedTemplate ? { ...selectedTemplate, content: draftContent } : null}
              onChangeContent={(val) => setDraftContent(val)}
              onSave={handleSaveDraft}
              onApply={() => setIsApplyModalOpen(true)}
            />
          </div>
        </div>

        {/* Diff Viewer (When content is modified) */}
        {selectedTemplate && selectedTemplate.content !== draftContent && (
          <section className="mb-8 md:mb-10">
            <DiffViewer
              original={selectedTemplate.content}
              modified={draftContent}
            />
          </section>
        )}

        {/* Execution Log Table */}
        <section className="mb-8">
          {logsLoading ? (
            <div className="h-64 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
          ) : (
            <ExecutionLog logs={logs} />
          )}
        </section>

        {/* Apply Confirmation Modal */}
        <ApplyTemplateModal
          template={selectedTemplate}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />

      </div>
    </RoleGuard>
  );
}

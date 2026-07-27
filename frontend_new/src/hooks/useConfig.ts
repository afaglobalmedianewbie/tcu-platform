import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { ConfigTemplate, ExecutionLog } from '../types/config';

export function useTemplates() {
  return useQuery<ConfigTemplate[]>({
    queryKey: ['config-templates'],
    queryFn: () => apiClient<ConfigTemplate[]>('/api/config/template/list'),
    placeholderData: [
      { id: 'tpl-1', name: 'GenieACS Provisioning Profile 50M', target: 'GENIEACS', content: 'const speed = 50;\ndeclare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username", {value: now}, {value: "pppoe_user"});', updatedAt: '2026-07-15 14:00' },
      { id: 'tpl-2', name: 'Postfix virtual_mailbox_maps Static', target: 'POSTFIX', content: 'virtual_mailbox_domains = topclassuniversal.co.id\nvirtual_mailbox_base = /var/mail/vhosts\nvirtual_uid_maps = static:5000\nvirtual_gid_maps = static:5000', updatedAt: '2026-07-12 09:30' },
      { id: 'tpl-3', name: 'FreeRADIUS Auth Policy Default', target: 'FREERADIUS', content: 'authorize {\n\tpreprocess\n\tchap\n\tmschap\n\tsuffix\n\teap\n\tfiles\n\tsql\n}', updatedAt: '2026-07-10 18:20' }
    ]
  });
}

export function useExecutionLogs() {
  return useQuery<ExecutionLog[]>({
    queryKey: ['config-execution-logs'],
    queryFn: () => apiClient<ExecutionLog[]>('/api/config/execution/logs'),
    refetchInterval: 25000,
    placeholderData: [
      { id: 'log-1', timestamp: '2026-07-16 10:45:00', templateName: 'GenieACS Provisioning Profile 50M', target: 'GenieACS (TR-069)', status: 'SUCCESS', operator: 'SUPERADMIN', details: 'Template diterapkan ke 12 ONT online.' },
      { id: 'log-2', timestamp: '2026-07-16 09:12:00', templateName: 'Postfix virtual_mailbox_maps Static', target: 'Postfix SMTP', status: 'SUCCESS', operator: 'ADMIN', details: 'Postmap database virtual mailbox diregenerasi.' },
      { id: 'log-3', timestamp: '2026-07-15 17:30:00', templateName: 'FreeRADIUS Auth Policy Default', target: 'FreeRADIUS Auth', status: 'FAILED', operator: 'OPERATOR', details: 'Radiusd reload failed: syntax error on line 42.' }
    ]
  });
}

export function useApplyTemplate() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; variables?: Record<string, string> }>({
    mutationFn: async ({ id, variables }) => {
      await apiClient('/api/config/template/apply', {
        method: 'POST',
        body: JSON.stringify({ id, variables })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-execution-logs'] });
    }
  });
}

export function useRollbackTemplate() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await apiClient(`/api/config/execution/rollback/${id}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-execution-logs'] });
    }
  });
}

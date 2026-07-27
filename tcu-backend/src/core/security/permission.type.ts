export type RoleType = 'super_admin' | 'admin' | 'finance' | 'noc' | 'helpdesk' | 'customer';

export type PermissionType = 
  | 'customer.read' | 'customer.create' | 'customer.update' | 'customer.delete'
  | 'customer.document.read' | 'customer.service.read'
  | 'package.read' | 'package.create' | 'package.update'
  | 'billing.read' | 'billing.create' | 'billing.update' | 'billing.approve'
  | 'billing.refund' | 'billing.adjustment' | 'billing.writeoff'
  | 'payment.read' | 'payment.create' | 'payment.reconcile'
  | 'collection.read'
  | 'ticket.read' | 'ticket.create' | 'ticket.assign' | 'ticket.escalate' | 'ticket.comment' | 'ticket.close'
  | 'notification.read' | 'notification.template.manage' | 'notification.broadcast';

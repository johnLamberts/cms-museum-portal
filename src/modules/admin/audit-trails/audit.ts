/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuditEvent {
  id?: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  created_at?: string;
}

export type AuditActionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'login' 
  | 'logout' 
  | 'export' 
  | 'import' 
  | 'approve' 
  | 'reject';

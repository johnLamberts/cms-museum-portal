/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AuditActionType } from '../audit';
import { AuditService } from '../service/audits.service';

export const useAudit = () => {
  const queryClient = useQueryClient();

  const logAuditEvent = useMutation({
    mutationFn: async ({
      userId,
      action,
      entityType,
      entityId,
      details = {},
    }: {
      userId: string,
      action: AuditActionType;
      entityType: string;
      entityId: string;
      details?: Record<string, any>;
    }) => {


      return AuditService.logEvent(
        userId,
        action,
        entityType,
        entityId,
        details
      );
    },
    onError: (error) => {
      console.error('Failed to log audit event:', error);
      // Don't show toast for authentication issues to avoid spamming the user
      if (!(error instanceof Error && error.message.includes('not available'))) {
        toast.error('Failed to log action');
      }
    },
    onSuccess: (data) => {
      // Only invalidate queries if we actually logged something
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      }
    },
  });

  // Create a wrapper function for common audit actions
  const logAction = (
    userId: string,
    action: AuditActionType,
    entityType: string,
    entityId: string,
    details: Record<string, any> = {}
  ) => {
    return logAuditEvent.mutate({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  };

  // Helper methods for common operations
  const logCreate = (userId: string, entityType: string, entityId: string, details = {}) => 
    logAction(userId, 'create', entityType, entityId, details);
  
  const logUpdate = (userId: string, entityType: string, entityId: string, details = {}) => 
    logAction(userId, 'update', entityType, entityId, details);
  
  const logDelete = (userId: string, entityType: string, entityId: string, details = {}) => 
    logAction(userId, 'delete', entityType, entityId, details);
  
  const logView = (userId: string, entityType: string, entityId: string, details = {}) => 
    logAction(userId, 'view', entityType, entityId, details);

  return {
    logAuditEvent: logAuditEvent.mutate,
    logAction,
    logCreate,
    logUpdate,
    logDelete,
    logView,
    isLogging: logAuditEvent.isPending,
  };
};

// Hook to fetch entity audit logs
export const useEntityAuditLogs = (
  entityType: string,
  entityId: string,
  page = 1,
  pageSize = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ['auditLogs', 'entity', entityType, entityId, page, pageSize],
    queryFn: () => AuditService.getEntityAuditLogs(entityType, entityId, page, pageSize),
    enabled: enabled && !!entityType && !!entityId,
  });
};

// Hook to fetch user audit logs
export const useUserAuditLogs = (
  userId: string,
  page = 1,
  pageSize = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ['auditLogs', 'user', userId, page, pageSize],
    queryFn: () => AuditService.getUserAuditLogs(userId, page, pageSize),
    enabled: enabled && !!userId,
  });
};

// Hook to search audit logs with filters
export const useSearchAuditLogs = (
  filters: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditActionType;
    startDate?: string;
    endDate?: string;
  },
  page = 1,
  pageSize = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ['auditLogs', 'search', filters, page, pageSize],
    queryFn: () => AuditService.searchAuditLogs(filters, page, pageSize),
    enabled,
  });
};

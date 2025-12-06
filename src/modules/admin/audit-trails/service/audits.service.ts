/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";
import { AuditActionType, AuditEvent } from "../audit";

// Initialize Supabase client
export class AuditService {
  /**
   * Log an audit event to the database
   */
  static async logEvent(
    userId: string,
    action: AuditActionType,
    entityType: string,
    entityId: string,
    details: Record<string, any> = {}
  ): Promise<AuditEvent | null> {

    console.log(userId, action, entityType, entityId, details);
    
    try {
      const auditEvent: AuditEvent = {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
      };

      const { data, error } = await supabase
        .from('audit_logs')
        .insert(auditEvent)
        .select()
        .single();

      if (error) {
        console.error('Error logging audit event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      return null;
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  static async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page = 1,
    pageSize = 10
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return { data: [], count: 0 };
      }

      return { data, count };
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Get audit logs for a specific user
   */
  static async getUserAuditLogs(
    userId: string,
    page = 1,
    pageSize = 10
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching user audit logs:', error);
        return { data: [], count: 0 };
      }

      return { data, count };
    } catch (error) {
      console.error('Failed to fetch user audit logs:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Search audit logs with filters
   */
  static async searchAuditLogs(
    filters: {
      userId?: string;
      entityType?: string;
      entityId?: string;
      action?: AuditActionType;
      startDate?: string;
      endDate?: string;
    },
    page = 1,
    pageSize = 10
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }

      if (filters.entityId) {
        query = query.eq('entity_id', filters.entityId);
      }

      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error('Error searching audit logs:', error);
        return { data: [], count: 0 };
      }

      return { data, count };
    } catch (error) {
      console.error('Failed to search audit logs:', error);
      return { data: [], count: 0 };
    }
  }
}

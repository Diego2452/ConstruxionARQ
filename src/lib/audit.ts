import { supabase } from '@/lib/supabase';

export type AuditAction =
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'project_images_updated'
  | 'user_created';

export async function logAction(
  action: AuditAction,
  description: string,
  opts?: {
    entityType?: string;
    entityId?:   string;
    entityName?: string;
    details?:    Record<string, unknown>;
  }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      action,
      entity_type:  opts?.entityType ?? 'project',
      entity_id:    opts?.entityId,
      entity_name:  opts?.entityName,
      description,
      details:      opts?.details ?? null,
      user_email:   user?.email ?? 'desconocido',
    });
  } catch {
    // Audit log failure is non-fatal
  }
}

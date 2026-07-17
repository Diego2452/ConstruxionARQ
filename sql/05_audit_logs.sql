-- ── Audit Log — ConstruxionARQ ─────────────────────────
-- Correr en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  action       TEXT        NOT NULL,  -- 'project_created', 'project_updated', etc.
  entity_type  TEXT        NOT NULL,  -- 'project' | 'user'
  entity_id    TEXT,
  entity_name  TEXT,                  -- título del proyecto o email del usuario
  description  TEXT        NOT NULL,  -- descripción legible del cambio
  details      JSONB,                 -- detalles extra (campos modificados, etc.)
  user_email   TEXT,                  -- quién realizó la acción
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Index para búsqueda y filtrado
CREATE INDEX IF NOT EXISTS audit_logs_action_idx    ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx    ON audit_logs(entity_type, entity_id);

-- RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados pueden leer y escribir
CREATE POLICY "Auth read audit_logs"
  ON audit_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth insert audit_logs"
  ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

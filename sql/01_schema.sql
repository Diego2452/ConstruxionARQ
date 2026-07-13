-- ── ConstruxionARQ — Supabase Schema ──────────────────
-- Correr en: Supabase → SQL Editor → New query

-- 1. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  location     TEXT,
  manager      TEXT,
  architect    TEXT,
  dimensions   TEXT,
  description  TEXT,
  year         TEXT,
  category     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. Project images table
CREATE TABLE IF NOT EXISTS project_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  src         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  caption     TEXT,
  is_primary  BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS project_images_project_id_idx ON project_images(project_id);
CREATE INDEX IF NOT EXISTS project_images_is_primary_idx ON project_images(project_id, is_primary);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS ─────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public: read only
CREATE POLICY "Public read projects"
  ON projects FOR SELECT TO anon USING (true);

CREATE POLICY "Public read images"
  ON project_images FOR SELECT TO anon USING (true);

-- Authenticated: full access
CREATE POLICY "Auth all projects"
  ON projects FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth all images"
  ON project_images FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

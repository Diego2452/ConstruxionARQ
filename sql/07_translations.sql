-- ── Correr en Supabase → SQL Editor ────────────────────────
-- Agrega campos de traducción al inglés

-- Proyectos: título y descripción en inglés
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_en       TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- About blocks: contenido en inglés (mismo esquema JSONB que content)
ALTER TABLE about_blocks
  ADD COLUMN IF NOT EXISTS content_en JSONB DEFAULT '{}';

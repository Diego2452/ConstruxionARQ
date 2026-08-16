-- ── Correr en Supabase → SQL Editor ────────────────────
-- Traducción de captions de imágenes al inglés

ALTER TABLE project_images
  ADD COLUMN IF NOT EXISTS caption_en TEXT;

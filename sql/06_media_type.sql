-- ── Correr en Supabase → SQL Editor ────────────────────────
-- Agrega soporte para videos en project_images

-- 1. Columna media_type en project_images
ALTER TABLE project_images
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';

-- Actualizar registros existentes
UPDATE project_images SET media_type = 'image' WHERE media_type IS NULL;

-- 2. Crear bucket project-videos (si no existe, crearlo manualmente
--    en Supabase → Storage → New bucket → "project-videos" → Public)

-- 3. Storage policies para project-videos
CREATE POLICY "Auth upload project videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Public view project videos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'project-videos');

CREATE POLICY "Auth update project videos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-videos');

CREATE POLICY "Auth delete project videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-videos');

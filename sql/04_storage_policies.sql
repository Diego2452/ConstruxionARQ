-- ── Correr en Supabase → SQL Editor ────────────────────────
-- Habilita subida de imágenes al bucket "project-images"
-- IMPORTANTE: El bucket debe estar en modo "Public" en
-- Supabase → Storage → project-images → Make public

-- Subida: solo usuarios autenticados
CREATE POLICY "Auth upload project images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Vista pública de imágenes
CREATE POLICY "Public view project images"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'project-images');

-- Actualizar/borrar: solo usuarios autenticados
CREATE POLICY "Auth update project images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Auth delete project images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-images');

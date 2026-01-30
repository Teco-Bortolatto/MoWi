-- ============================================
-- 🖼️ IMAGEM EM OBJETIVOS + BUCKET goal-thumbs
-- Plano gratuito: thumbs pequenos (max 256 KB)
-- ============================================

-- Coluna opcional para thumb horizontal do objetivo
ALTER TABLE goals
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Bucket para thumbs dos objetivos (tamanho modesto para plano gratuito)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'goal-thumbs',
  'goal-thumbs',
  true,
  262144, -- 256 KB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 262144,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Políticas para goal-thumbs
CREATE POLICY "Goal thumbs are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'goal-thumbs');

CREATE POLICY "Users can upload own goal thumbs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'goal-thumbs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own goal thumbs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'goal-thumbs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own goal thumbs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'goal-thumbs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

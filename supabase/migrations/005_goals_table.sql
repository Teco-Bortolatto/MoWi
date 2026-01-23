-- ============================================
-- 🎯 METAS (GOALS)
-- ============================================

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  deadline DATE,
  category TEXT,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_member_id ON goals(member_id);

-- Habilitar RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Somente o dono do dado)
CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Todas as políticas permitem acesso total ao usuário autenticado
-- para seus próprios dados (baseado em user_id)

-- ============================================
-- 👤 USUÁRIOS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver apenas seu próprio registro
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Política: Usuário pode inserir apenas seu próprio registro
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- Política: Usuário pode atualizar apenas seu próprio registro
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Política: Usuário pode deletar apenas seu próprio registro
CREATE POLICY "Users can delete own data"
  ON users FOR DELETE
  USING (auth.uid()::text = id::text);

-- ============================================
-- 👨‍👩‍👧‍👦 MEMBROS DA FAMÍLIA
-- ============================================

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view own data"
  ON family_members FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Family members can insert own data"
  ON family_members FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Family members can update own data"
  ON family_members FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Family members can delete own data"
  ON family_members FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- ============================================
-- 🏷️ CATEGORIAS
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories can view own data"
  ON categories FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Categories can insert own data"
  ON categories FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Categories can update own data"
  ON categories FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Categories can delete own data"
  ON categories FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- ============================================
-- 💳 CONTAS E CARTÕES
-- ============================================

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accounts can view own data"
  ON accounts FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Accounts can insert own data"
  ON accounts FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Accounts can update own data"
  ON accounts FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Accounts can delete own data"
  ON accounts FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- ============================================
-- 💰 TRANSAÇÕES
-- ============================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions can view own data"
  ON transactions FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Transactions can insert own data"
  ON transactions FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Transactions can update own data"
  ON transactions FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Transactions can delete own data"
  ON transactions FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- ============================================
-- 💫 TRANSAÇÕES RECORRENTES
-- ============================================

ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recurring transactions can view own data"
  ON recurring_transactions FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Recurring transactions can insert own data"
  ON recurring_transactions FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Recurring transactions can update own data"
  ON recurring_transactions FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Recurring transactions can delete own data"
  ON recurring_transactions FOR DELETE
  USING (user_id::text = auth.uid()::text);

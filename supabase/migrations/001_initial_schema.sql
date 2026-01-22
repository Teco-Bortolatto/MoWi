-- ============================================
-- 🗄️ MIGRATION: Schema Inicial MoWi
-- ============================================
-- Cria todas as tabelas, enums, índices e RLS
-- Baseado no schema Prisma fornecido

-- ============================================
-- 🔧 ENUMS
-- ============================================

CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');

-- ============================================
-- 👤 USUÁRIOS
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 👨‍👩‍👧‍👦 MEMBROS DA FAMÍLIA
-- ============================================

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  monthly_income DECIMAL(12, 2) DEFAULT 0,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_members_user_id ON family_members(user_id);

-- ============================================
-- 🏷️ CATEGORIAS
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📌',
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_user_id_type ON categories(user_id, type);

-- ============================================
-- 💳 CONTAS E CARTÕES (UNIFICADO)
-- ============================================

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type account_type NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last_digits TEXT,
  holder_id UUID NOT NULL REFERENCES family_members(id) ON DELETE RESTRICT,
  
  -- Campos para conta corrente e poupança
  balance DECIMAL(12, 2) DEFAULT 0,
  
  -- Campos para cartão de crédito
  credit_limit DECIMAL(12, 2),
  current_bill DECIMAL(12, 2) DEFAULT 0,
  due_day INTEGER CHECK (due_day IS NULL OR (due_day >= 1 AND due_day <= 31)),
  closing_day INTEGER CHECK (closing_day IS NULL OR (closing_day >= 1 AND closing_day <= 31)),
  theme TEXT DEFAULT 'black',
  logo_url TEXT,
  
  -- Metadata
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id_type ON accounts(user_id, type);
CREATE INDEX idx_accounts_holder_id ON accounts(holder_id);

-- ============================================
-- 💰 TRANSAÇÕES
-- ============================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Parcelamento
  installment_number INTEGER CHECK (installment_number IS NULL OR (installment_number >= 1 AND installment_number <= 12)),
  total_installments INTEGER DEFAULT 1 CHECK (total_installments >= 1 AND total_installments <= 12),
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_transaction_id UUID,
  
  -- Status
  status transaction_status DEFAULT 'COMPLETED',
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_recurring_transaction_id ON transactions(recurring_transaction_id);
CREATE INDEX idx_transactions_parent_transaction_id ON transactions(parent_transaction_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ============================================
-- 💫 DESPESAS RECORRENTES (TEMPLATE)
-- ============================================

CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type DEFAULT 'EXPENSE',
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Configuração de recorrência
  frequency recurrence_frequency NOT NULL,
  day_of_month INTEGER CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31)),
  day_of_week INTEGER CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recurring_transactions_user_id_is_active ON recurring_transactions(user_id, is_active);
CREATE INDEX idx_recurring_transactions_category_id ON recurring_transactions(category_id);
CREATE INDEX idx_recurring_transactions_account_id ON recurring_transactions(account_id);

-- Adicionar foreign key para recurring_transaction_id em transactions
ALTER TABLE transactions 
ADD CONSTRAINT fk_transactions_recurring_transaction_id 
FOREIGN KEY (recurring_transaction_id) 
REFERENCES recurring_transactions(id) 
ON DELETE SET NULL;

-- ============================================
-- 🔄 TRIGGERS PARA updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

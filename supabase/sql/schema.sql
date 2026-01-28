-- supabase/sql/schema.sql
-- Schema + policies + helper functions for MoWi Supabase

-- Utilities
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_owner
  ON users FOR ALL
  USING (auth.uid()::TEXT = id::TEXT)
  WITH CHECK (auth.uid()::TEXT = id::TEXT);

-- Family Members
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  monthly_income DECIMAL(12,2) DEFAULT 0,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY family_members_owner
  ON family_members FOR ALL
  USING (auth.uid()::TEXT = user_id::TEXT)
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Categories
CREATE TYPE IF NOT EXISTS transaction_type AS ENUM ('INCOME','EXPENSE');

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📌',
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_user_id_type ON categories(user_id, type);
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_owner
  ON categories FOR ALL
  USING (auth.uid()::TEXT = user_id::TEXT)
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Accounts
CREATE TYPE IF NOT EXISTS account_type AS ENUM ('CHECKING','SAVINGS','CREDIT_CARD');

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type account_type NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last_digits TEXT,
  holder_id UUID REFERENCES family_members(id) ON DELETE RESTRICT,
  balance DECIMAL(12,2) DEFAULT 0,
  credit_limit DECIMAL(12,2),
  current_bill DECIMAL(12,2) DEFAULT 0,
  due_day INT,
  closing_day INT,
  theme TEXT DEFAULT 'black',
  logo_url TEXT,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_holder_id ON accounts(holder_id);
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY accounts_owner
  ON accounts FOR ALL
  USING (auth.uid()::TEXT = user_id::TEXT)
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Transactions
CREATE TYPE IF NOT EXISTS transaction_status AS ENUM ('PENDING','COMPLETED');

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT DEFAULT '',
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  installment_number INT,
  total_installments INT DEFAULT 1,
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_transaction_id UUID REFERENCES recurring_transactions(id) ON DELETE SET NULL,
  status transaction_status DEFAULT 'COMPLETED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_recurring_id ON transactions(recurring_transaction_id);
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY transactions_owner
  ON transactions FOR ALL
  USING (auth.uid()::TEXT = user_id::TEXT)
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Recurring Transactions
CREATE TYPE IF NOT EXISTS recurrence_frequency AS ENUM ('DAILY','WEEKLY','MONTHLY','YEARLY');

CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type DEFAULT 'EXPENSE',
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  frequency recurrence_frequency NOT NULL,
  day_of_month INT,
  day_of_week INT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_recurring_user_id ON recurring_transactions(user_id);
CREATE TRIGGER update_recurring_updated_at BEFORE UPDATE ON recurring_transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY recurring_owner
  ON recurring_transactions FOR ALL
  USING (auth.uid()::TEXT = user_id::TEXT)
  WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Views/RPC helpers
CREATE OR REPLACE FUNCTION fetch_transactions_with_category(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  type TEXT,
  amount DECIMAL,
  description TEXT,
  date DATE,
  category TEXT,
  account TEXT,
  member TEXT,
  status TEXT
) LANGUAGE sql AS $$
  SELECT
    t.id,
    t.type::text,
    t.amount,
    t.description,
    t.date,
    c.name AS category,
    a.name AS account,
    fm.name AS member,
    t.status::text
  FROM transactions t
  LEFT JOIN categories c ON c.id = t.category_id
  LEFT JOIN accounts a ON a.id = t.account_id
  LEFT JOIN family_members fm ON fm.id = t.member_id
  WHERE t.user_id = p_user_id
  ORDER BY t.date DESC;
$$;


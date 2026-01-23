-- ============================================
-- 🗄️ MIGRATION FINAL MoWi
-- ============================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELAS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_members (
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

CREATE TABLE IF NOT EXISTS categories (
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

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type account_type NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last_digits TEXT,
  holder_id UUID NOT NULL REFERENCES family_members(id) ON DELETE RESTRICT,
  balance DECIMAL(12, 2) DEFAULT 0,
  credit_limit DECIMAL(12, 2),
  current_bill DECIMAL(12, 2) DEFAULT 0,
  due_day INTEGER,
  closing_day INTEGER,
  theme TEXT DEFAULT 'black',
  logo_url TEXT,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  installment_number INTEGER,
  total_installments INTEGER DEFAULT 1,
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  is_recurring BOOLEAN DEFAULT FALSE,
  status transaction_status DEFAULT 'COMPLETED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
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

-- 3. RLS (SEGURANÇA)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can manage own data" ON users FOR ALL USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage own family" ON family_members FOR ALL USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage own accounts" ON accounts FOR ALL USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. TRIGGERS (AUTOMAÇÃO)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.family_members (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 'Membro');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('account-logos', 'account-logos', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('documents', 'documents', false, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4', 'video/quicktime', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

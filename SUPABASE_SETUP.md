# 🚀 Guia de Setup do Supabase - MoWi

## 📋 Pré-requisitos

1. Conta no Supabase criada
2. Projeto criado no Supabase Dashboard
3. URL e chave anônima do projeto

---

## 🔧 Passo 1: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Onde encontrar essas informações:**
- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
- Vá em **Settings** → **API**
- Copie a **URL** e a **anon/public key**

---

## 🗄️ Passo 2: Aplicar Migrations

### Opção A: Via Supabase Dashboard (Recomendado)

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute cada migration na ordem:

#### Migration 1: Schema Inicial
- Abra o arquivo `supabase/migrations/001_initial_schema.sql`
- Copie todo o conteúdo
- Cole no SQL Editor
- Clique em **Run**

#### Migration 2: RLS Policies
- Abra o arquivo `supabase/migrations/002_rls_policies.sql`
- Copie todo o conteúdo
- Cole no SQL Editor
- Clique em **Run**

#### Migration 3: Storage Buckets
- Abra o arquivo `supabase/migrations/003_storage_buckets.sql`
- Copie todo o conteúdo
- Cole no SQL Editor
- Clique em **Run**

#### Migration 4: Auth Trigger
- Abra o arquivo `supabase/migrations/004_auth_trigger.sql`
- Copie todo o conteúdo
- Cole no SQL Editor
- Clique em **Run**

### Opção B: Via CLI do Supabase

Se você tem o Supabase CLI instalado:

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar ao projeto
supabase link --project-ref seu-project-ref

# Aplicar migrations
supabase db push
```

---

## ✅ Passo 3: Verificar Instalação

### Verificar Tabelas

No SQL Editor, execute:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver:
- `users`
- `family_members`
- `categories`
- `accounts`
- `transactions`
- `recurring_transactions`

### Verificar RLS

No SQL Editor, execute:

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Você deve ver políticas para todas as tabelas.

### Verificar Storage Buckets

1. Vá em **Storage** no Dashboard
2. Você deve ver 3 buckets:
   - `avatars`
   - `account-logos`
   - `documents`

---

## 🔐 Passo 4: Configurar Autenticação

1. No Supabase Dashboard, vá em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Configure as opções desejadas:
   - ✅ Enable email confirmations (opcional)
   - ✅ Enable email change (opcional)

---

## 🧪 Passo 5: Testar a Integração

### Criar um Usuário de Teste

No SQL Editor, execute (substitua os valores):

```sql
-- Criar usuário via Auth (use o Dashboard ou API)
-- Depois, verificar se foi criado na tabela users:
SELECT * FROM users;
```

### Testar RLS

1. Crie um usuário de teste via Dashboard
2. Faça login no frontend
3. Tente criar uma transação
4. Verifique se os dados aparecem apenas para o usuário logado

---

## 📦 Estrutura de Migrations

```
supabase/
└── migrations/
    ├── 001_initial_schema.sql      # Tabelas e enums
    ├── 002_rls_policies.sql               # Row Level Security
    ├── 003_storage_buckets.sql            # Storage buckets
    └── 004_auth_trigger.sql                # Trigger de criação de usuário
```

---

## 🔄 Próximos Passos

Após aplicar as migrations:

1. ✅ Configurar variáveis de ambiente
2. ✅ Aplicar migrations
3. ✅ Verificar instalação
4. ⏭️ Refatorar `FinanceContext` para usar Supabase
5. ⏭️ Criar componentes de autenticação
6. ⏭️ Testar todas as funcionalidades

---

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Verifique se todas as migrations foram aplicadas na ordem
- Execute novamente a migration que está faltando

### Erro: "permission denied"
- Verifique se as políticas RLS foram aplicadas
- Verifique se o usuário está autenticado

### Erro: "bucket does not exist"
- Verifique se a migration `003_storage_buckets.sql` foi executada
- Verifique se os buckets aparecem no Dashboard

### Erro: "function does not exist"
- Verifique se a migration `004_auth_trigger.sql` foi executada
- Verifique se a função `handle_new_user()` existe

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Migration 001 aplicada (schema)
- [ ] Migration 002 aplicada (RLS)
- [ ] Migration 003 aplicada (storage)
- [ ] Migration 004 aplicada (auth trigger)
- [ ] Tabelas verificadas
- [ ] RLS verificadas
- [ ] Storage buckets verificados
- [ ] Autenticação configurada
- [ ] Teste de criação de usuário funcionando

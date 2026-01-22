# 📋 Plano de Integração Supabase - MoWi

## 🎯 Objetivo
Migrar completamente do sistema de dados mock para banco de dados real no Supabase, mantendo toda funcionalidade existente.

---

## 📊 Fase 1: Configuração Base

### 1.1 Configuração do Cliente Supabase
- [x] Instalar `@supabase/supabase-js` (já instalado)
- [ ] Criar arquivo de configuração `src/lib/supabase.ts`
- [ ] Configurar variáveis de ambiente (`.env.local`)
- [ ] Criar tipos TypeScript baseados no schema

### 1.2 Autenticação
- [ ] Configurar autenticação email/password
- [ ] Criar hook `useAuth` para gerenciar sessão
- [ ] Criar componente de Login/Register
- [ ] Proteger rotas com autenticação

---

## 🗄️ Fase 2: Banco de Dados

### 2.1 Migrations SQL
Criar migrations para todas as tabelas do schema Prisma:

1. **users** - Tabela de usuários autenticados
2. **family_members** - Membros da família
3. **categories** - Categorias de transações
4. **accounts** - Contas bancárias e cartões (unificado)
5. **transactions** - Transações financeiras
6. **recurring_transactions** - Templates de transações recorrentes

### 2.2 Enums
- TransactionType (INCOME, EXPENSE)
- AccountType (CHECKING, SAVINGS, CREDIT_CARD)
- RecurrenceFrequency (DAILY, WEEKLY, MONTHLY, YEARLY)
- TransactionStatus (PENDING, COMPLETED)

### 2.3 Índices
- Criar todos os índices especificados no schema
- Otimizar queries mais comuns

---

## 🔒 Fase 3: Row Level Security (RLS)

### 3.1 Políticas RLS
Para TODAS as tabelas, criar políticas que permitem:
- **SELECT**: Usuário pode ver apenas seus próprios dados
- **INSERT**: Usuário pode criar apenas seus próprios dados
- **UPDATE**: Usuário pode atualizar apenas seus próprios dados
- **DELETE**: Usuário pode deletar apenas seus próprios dados

### 3.2 Funções Helper
- Criar função `auth.uid()` para identificar usuário atual
- Criar políticas baseadas em `user_id`

---

## 📦 Fase 4: Storage

### 4.1 Buckets
1. **avatars** - Imagens de perfil (usuários e membros)
2. **account-logos** - Logos de bancos/cartões
3. **documents** - Documentos e comprovantes (opcional)

### 4.2 Políticas de Storage
- Usuário pode fazer upload apenas de seus próprios arquivos
- Usuário pode visualizar apenas seus próprios arquivos
- Tamanho máximo: 5MB por arquivo
- Tipos permitidos: image/*, application/pdf

---

## 🔧 Fase 5: Services e Hooks

### 5.1 Services
Criar services para cada entidade:
- `userService.ts` - CRUD de usuários
- `familyMemberService.ts` - CRUD de membros
- `categoryService.ts` - CRUD de categorias
- `accountService.ts` - CRUD de contas/cartões
- `transactionService.ts` - CRUD de transações
- `recurringTransactionService.ts` - CRUD de templates recorrentes

### 5.2 Hooks Customizados
- `useAuth.ts` - Autenticação
- `useSupabaseQuery.ts` - Queries reativas
- `useSupabaseMutation.ts` - Mutations otimistas

---

## 🔄 Fase 6: Refatoração do Context

### 6.1 FinanceContext
- Remover todos os dados mock
- Substituir por chamadas ao Supabase
- Manter mesma interface pública
- Adicionar loading states
- Adicionar error handling

### 6.2 Real-time Subscriptions
- Subscribir a mudanças em tempo real
- Atualizar UI automaticamente quando dados mudam

---

## ✅ Fase 7: Testes e Validação

### 7.1 Testes Funcionais
- [ ] Criar usuário e fazer login
- [ ] CRUD completo de todas as entidades
- [ ] Upload de imagens
- [ ] Filtros e buscas
- [ ] Cálculos financeiros

### 7.2 Performance
- [ ] Verificar queries lentas
- [ ] Otimizar índices se necessário
- [ ] Testar com grande volume de dados

---

## 📝 Estrutura de Arquivos

```
src/
├── lib/
│   └── supabase.ts              # Cliente Supabase
├── services/
│   ├── userService.ts
│   ├── familyMemberService.ts
│   ├── categoryService.ts
│   ├── accountService.ts
│   ├── transactionService.ts
│   └── recurringTransactionService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useSupabaseQuery.ts
│   └── useSupabaseMutation.ts
├── contexts/
│   └── FinanceContext.tsx       # Refatorado para usar Supabase
└── types/
    └── database.ts               # Tipos gerados do Supabase
```

---

## 🚀 Ordem de Implementação

1. ✅ Configuração base (Supabase client)
2. ✅ Autenticação básica
3. ✅ Migrations SQL
4. ✅ RLS Policies
5. ✅ Storage buckets
6. ✅ Services básicos
7. ✅ Refatorar FinanceContext
8. ✅ Testes e ajustes

---

## 🔐 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📚 Documentação de Referência

- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

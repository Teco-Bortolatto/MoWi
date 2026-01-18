# 📋 PROMPT 0: Análise e Planejamento Inicial — CONCLUÍDO

## 📚 PRÉ-EXECUÇÃO
✓ Rules relidas e aplicadas
✓ Figma consultado e analisado (via link e descrição da imagem)
✓ Hierarquia de variáveis verificada
✓ Arquivo de variáveis JSON analisado

---

## 1️⃣ MAPEAMENTO DE COMPONENTES VISUAIS

### Dashboard Principal (Tela Atual)

#### A. Sidebar (Navegação Principal - Esquerda)
**Componentes identificados:**
- `SidebarLogo` - Logo "MoWi" (azul escuro)
- `SidebarNavItem` - Itens de navegação (Home, Cartões)
  - Estado ativo: "Cartões" (fundo azul, texto branco)
  - Estado inativo: "Home" (texto cinza claro)
- `SidebarUserInfo` - Informações do usuário (inferior)
  - Avatar do usuário
  - Email: "MoWill_95@gmail.com"
  - Nome: "Moises Wilson"
  - Botão de navegação (seta para esquerda)

**Estados:**
- **Desktop (≥1280px):**
  - Expanded: Larga, com texto e ícones
  - Collapsed: Estreita, apenas ícones
- **Mobile/Tablet (<1280px):**
  - Não renderiza (substituído por Header Mobile)

#### B. Header (Superior)
**Componentes identificados:**
- `SearchBar` - Campo "Pesquisar" com ícone de lupa
- `DateFilter` - Filtro "01 Jan - 31 Jan 2026" com ícone de calendário
- `FilterButton` - Ícone de filtro adicional
- `UserAvatars` - Dois avatares + botão "+" para adicionar
- `PrimaryButton` - "Nova Transação" (fundo azul escuro, ícone "+")

**Comportamento:**
- Desktop: Header completo
- Mobile: Header simplificado com menu drawer

#### C. Conteúdo Principal

**1. Distribuição de Despesas (Linha Superior)**
- `ExpenseDistributionCard` (4 cards)
  - `DonutChart` - Gráfico de donut
  - `ExpenseItem` - Item de despesa
    - Aluguel: R$ 4.000,00 (25% preenchido)
    - Alimentação: R$ 1.600,00 (10% preenchido)
    - Roupas: R$ 800,00 (5% preenchido)
    - Shows: R$ 400,00 (2,5% preenchido)

**2. Resumo Financeiro (Linha do Meio)**
- `FinancialSummaryCard` (3 cards)
  - `BalanceCard` - Saldo Total: R$ 12.000,00 (ícone carteira)
  - `IncomeCard` - Receita: R$ 8.000,00 (ícone seta ↑ verde)
  - `ExpenseCard` - Despesas: R$ 8.000,00 (ícone seta ↓ vermelho)

**3. Cartões/Contas (Coluna Direita, Superior)**
- `CardsAccountsCard`
  - Título com navegação (setas ← →) e botão "+"
  - `AccountItem` (lista)
    - PicPay: R$ 1200, Vencimento: 20/01, **** 6769
    - Nubank: R$ 1200, Vencimento: 20/01, **** 6769
    - XP Investimentos: R$ 1200, Vencimento: 20/01, **** 6769

**4. Fluxo Financeiro (Centro, Abaixo do Resumo)**
- `FinancialFlowChart`
  - Título com ícone de gráfico de linha
  - Legenda: "Despesas" (círculo vermelho), "Receitas" (círculo verde)
  - Gráfico de área: JAN a DEC
  - Eixo Y: R$ 0,00 a R$ 17.500 (incrementos de R$ 2.500)

**5. Próximas Despesas (Coluna Direita, Abaixo)**
- `UpcomingExpensesCard`
  - Título com ícone de calendário e botão "+"
  - `ExpenseListItem` (lista)
    - Conta de luz: Vence dia 21/01, Nubank Crédito, R$ 123,00, ícone check verde

**6. Extrato Detalhado (Inferior, Largura Total)**
- `DetailedStatementCard`
  - Título com ícone de livro
  - `SearchFilterBar` - "Buscar lançamentos" com dropdown "Todos"
  - `StatementTable`
    - Colunas: Membro, Datas, Descrição, Categoria, Conta/Cartão, Parcelas, Valor
    - Linhas de exemplo com dados
  - `Pagination` - "Mostrando 1 de 17" com navegação < 1 2 3 4 5 >

---

## 2️⃣ VARIÁVEIS DO DESIGN SYSTEM

### Cores Primitivas Disponíveis

#### Neutral (Cinzas)
- `color/neutral/0` → `#FFFFFF` (branco)
- `color/neutral/100` → `#F9FAFB`
- `color/neutral/200` → `#F3F4F6`
- `color/neutral/300` → `#E5E7EB`
- `color/neutral/400` → `#D1D5DB`
- `color/neutral/500` → `#9CA3AF`
- `color/neutral/600` → `#6B7280`
- `color/neutral/700` → `#4B5563`
- `color/neutral/800` → `#374151`
- `color/neutral/900` → `#1F2937`
- `color/neutral/1000` → `#111827`
- `color/neutral/1100` → `#080B12` (preto)

#### Brand (Azul - Cor Principal)
- `color/brand/100` → `#E6E9F7`
- `color/brand/200` → `#B0BBE6`
- `color/brand/300` → `#8A9ADA`
- `color/brand/400` → `#546CC9`
- `color/brand/500` → `#0023AF` (azul principal)
- `color/brand/600` → `#0023AF`
- `color/brand/700` → `#00209F`
- `color/brand/800` → `#00197C`
- `color/brand/900` → `#001360`
- `color/brand/1000` → `#000F4A`

#### Cores Semânticas (Inferidas do Design)
- **Success (Verde):** `color/green/600` → `#15BE78` (receitas)
- **Danger (Vermelho):** `color/red/600` → `#E61E32` (despesas)
- **Purple, Pink, Orange, Yellow, Blue:** Escalas completas disponíveis

### Espaçamento (Space)

**Valores Positivos:**
- `space/0` → 0px
- `space/2` → 2px
- `space/4` → 4px
- `space/6` → 6px
- `space/8` → 8px
- `space/12` → 12px
- `space/16` → 16px (padrão mobile)
- `space/20` → 20px
- `space/24` → 24px (padrão tablet)
- `space/32` → 32px (padrão desktop)
- `space/40` → 40px
- `space/48` → 48px
- `space/56` → 56px
- `space/64` → 64px
- `space/72` → 72px
- `space/80` → 80px
- `space/88` → 88px
- `space/96` → 96px
- `space/104` → 104px
- `space/112` → 112px
- `space/120` → 120px
- `space/128` → 128px

**Valores Negativos:**
- `space/negative/2` até `space/negative/48`

### Tamanhos (Size)
- `size/0` até `size/128`
- `size/160`, `size/320`, `size/640`, `size/720`
- `size/1024`, `size/1280`, `size/1440`

### Shape (Border Radius)
- `shape/0` → 0px
- `shape/2` → 2px
- `shape/4` → 4px
- `shape/6` → 6px
- `shape/8` → 8px
- `shape/12` → 12px
- `shape/16` → 16px
- `shape/20` → 20px
- `shape/24` → 24px
- `shape/32` → 32px
- `shape/100` → 100px (círculo)

### Opacidade
- `opacity/0` até `opacity/100` (0% a 100%)

### Tipografia

**Tamanhos de Fonte:**
- Display: `font/size/display/large` (96px), `medium` (64px), `small` (44px), `x-small` (36px)
- Heading: `xx-large` (40px), `x-large` (36px), `large` (32px), `medium` (28px), `small` (24px), `x-small` (20px)
- Label: `large` (18px), `medium` (16px), `small` (14px), `x-small` (12px)
- Paragraph: `large` (18px), `medium` (16px), `small` (14px), `x-small` (12px)

**Pesos:**
- `font/weight/bold` → 700
- `font/weight/semibold` → 600
- `font/weight/regular` → 400

**Line Height:**
- `font/line-height/spaced` → 170%
- `font/line-height/default` → 140%
- `font/line-height/tight` → 120%

**Letter Spacing:**
- `font/letter-spacing/spaced` → 2.5px
- `font/letter-spacing/default` → 0px
- `font/letter-spacing/tight` → -1px

### Sombras (Shadow)

**Cores:**
- Neutral: `shadow/color/neutral/0` até `shadow/color/neutral/100`
- Brand: `shadow/color/brand/0` até `shadow/color/brand/100`

**Offset X:**
- Right: `shadow/offsetX/right/0` até `shadow/offsetX/right/32`
- Left: `shadow/offsetX/left/0` até `shadow/offsetX/left/32`

**Offset Y:**
- Down: `shadow/offsetY/down/0` até `shadow/offsetY/down/32`
- Up: `shadow/offsetY/up/0` até `shadow/offsetY/up/32`

**Blur:**
- `shadow/blur/0` até `shadow/blur/32`

**Spread:**
- `shadow/spread/0` até `shadow/spread/4`

---

## 3️⃣ ESTRUTURA DE NAVEGAÇÃO

### Sidebar Desktop (≥1280px)
- **Estado Expanded:**
  - Largura: ~240px (estimado)
  - Exibe: Logo + texto dos itens + ícones
  - Informações do usuário completas
- **Estado Collapsed:**
  - Largura: ~64px (estimado)
  - Exibe: Apenas ícones
  - Informações do usuário minimizadas
- **Transição:** Botão de seta na parte inferior

### Header Mobile (<1280px)
- **Componentes:**
  - Botão de menu (abre drawer)
  - Ações principais (ex: "Nova Transação")
  - Logo ou título
- **Comportamento:**
  - Drawer overlay ao abrir menu
  - Não renderiza junto com Sidebar

### Navegação entre Seções
- **Seções identificadas:**
  - Home (Dashboard)
  - Cartões (atual)
  - Transações (inferido)
  - Perfil (inferido)
- **Transição:** Clicar nos itens da Sidebar (desktop) ou menu drawer (mobile)

---

## 4️⃣ ARQUITETURA PROPOSTA

### Estrutura de Pastas

```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── ui/                    # Componentes genéricos
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── Chart/
│   ├── layout/                 # Componentes de layout
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── HeaderMobile/
│   │   └── MainContentWrapper/
│   └── features/               # Componentes de features
│       ├── dashboard/
│       │   ├── ExpenseDistribution/
│       │   ├── FinancialSummary/
│       │   ├── FinancialFlowChart/
│       │   ├── CardsAccounts/
│       │   ├── UpcomingExpenses/
│       │   └── DetailedStatement/
│       ├── cards/
│       └── transactions/
├── hooks/                      # Custom hooks
│   ├── useSidebar.ts
│   ├── useFinancialData.ts
│   └── useResponsive.ts
├── services/                   # API e backend
│   └── supabase/
│       ├── transactions.ts
│       ├── cards.ts
│       └── users.ts
├── pages/                      # Páginas (apenas composição)
│   ├── DashboardPage.tsx
│   ├── CardsPage.tsx
│   ├── TransactionsPage.tsx
│   └── ProfilePage.tsx
├── styles/                     # Estilos globais
│   ├── tailwind.config.ts
│   ├── globals.css
│   └── variables.css          # CSS Variables do design system
├── utils/                      # Funções utilitárias
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   └── formatNumber.ts
└── types/                      # TypeScript types
    ├── transaction.ts
    ├── card.ts
    └── user.ts
```

### Hierarquia de Componentes

```
App.tsx
└── Layout.tsx
    ├── Sidebar (condicional: ≥1280px)
    │   ├── SidebarLogo
    │   ├── SidebarNavItem[]
    │   └── SidebarUserInfo
    ├── Header (condicional: <1280px)
    │   ├── HeaderMobile
    │   │   ├── MenuButton
    │   │   └── PrimaryActionButton
    │   └── Drawer (overlay)
    └── MainContentWrapper
        └── Router
            ├── DashboardPage
            │   ├── ExpenseDistribution
            │   │   └── ExpenseDistributionCard[]
            │   ├── FinancialSummary
            │   │   └── FinancialSummaryCard[]
            │   ├── FinancialFlowChart
            │   ├── CardsAccounts
            │   ├── UpcomingExpenses
            │   └── DetailedStatement
            ├── CardsPage
            ├── TransactionsPage
            └── ProfilePage
```

### Estratégia de Componentização

**1. Componentes Atômicos (UI):**
- `Button`, `Input`, `Card`, `Icon`, `Avatar`, `Badge`
- Reutilizáveis, sem lógica de negócio

**2. Componentes Moleculares (Layout):**
- `Sidebar`, `Header`, `HeaderMobile`, `MainContentWrapper`
- Encapsulam estrutura de layout
- Responsivos por padrão

**3. Componentes de Features:**
- `ExpenseDistribution`, `FinancialSummary`, `FinancialFlowChart`
- Encapsulam lógica específica de negócio
- Compõem componentes UI

**4. Páginas:**
- Apenas compõem features e layout
- Sem lógica de negócio
- Roteamento via React Router

**5. Hooks:**
- `useSidebar` - Estado expandido/colapsado
- `useFinancialData` - Busca dados do Supabase
- `useResponsive` - Breakpoints e media queries

**6. Services:**
- Abstração da API do Supabase
- Funções de CRUD para transações, cartões, usuários

### Responsividade

**Breakpoints Tailwind:**
```typescript
screens: {
  'md': '768px',   // Tablet
  'lg': '1280px',  // Desktop
  'xl': '1920px',  // Wide / 4K
}
```

**Estratégia Mobile-First:**
- Base: Mobile (< 768px)
- Tablet: ≥ 768px
- Desktop: ≥ 1280px
- Wide: ≥ 1920px

**Grids Responsivos:**
- Mobile: 1 coluna
- Tablet: 2 colunas (quando fizer sentido)
- Desktop: 3-4 colunas (dependendo do componente)

**Padding do Conteúdo Principal:**
- Mobile: `px-4` (16px) → `space/16`
- Tablet: `px-6` (24px) → `space/24`
- Desktop: `px-8` (32px) → `space/32`

**Max-Width:**
- Desktop: `max-w-[1400px]`
- Wide: `max-w-[1600px]`

---

## 5️⃣ MAPEAMENTO DE TOKENS (Figma → Código)

### Cores Identificadas no Design

**Azul Escuro (Sidebar, Botões Principais):**
- Figma: Azul escuro → `color/brand/900` ou `color/brand/1000`
- Uso: Sidebar background, botão "Nova Transação", item ativo

**Azul Claro (Gráficos):**
- Figma: Azul dos gráficos → `color/brand/500` ou `color/brand/600`
- Uso: Preenchimento de donut charts

**Verde (Receitas):**
- Figma: Verde → `color/green/600` (`#15BE78`)
- Uso: Ícones de receita, área verde do gráfico

**Vermelho (Despesas):**
- Figma: Vermelho → `color/red/600` (`#E61E32`)
- Uso: Ícones de despesas, área vermelha do gráfico

**Cinza Claro (Fundo de Cards):**
- Figma: Branco/Cinza muito claro → `color/neutral/0` ou `color/neutral/100`
- Uso: Background de cards

**Cinza Médio (Texto Secundário):**
- Figma: Cinza médio → `color/neutral/500` ou `color/neutral/600`
- Uso: Labels, texto secundário

**Cinza Escuro (Texto Principal):**
- Figma: Preto/Cinza escuro → `color/neutral/900` ou `color/neutral/1000`
- Uso: Títulos, valores principais

### Espaçamentos Identificados

**Padding de Cards:**
- Estimado: 16px-24px → `space/16` ou `space/24`

**Gap entre Cards:**
- Estimado: 16px-24px → `space/16` ou `space/24`

**Padding do Conteúdo Principal:**
- Mobile: 16px → `space/16`
- Tablet: 24px → `space/24`
- Desktop: 32px → `space/32`

### Tipografia Identificada

**Títulos de Seção:**
- "Fluxo financeiro", "Cartões/contas" → `font/size/heading/medium` (28px) ou `font/size/heading/small` (24px)
- Peso: `font/weight/bold` (700)

**Valores Principais:**
- "R$ 12.000,00" → `font/size/heading/small` (24px) ou `font/size/label/large` (18px)
- Peso: `font/weight/bold` (700)

**Labels e Texto Secundário:**
- "Vencimento: 20/01" → `font/size/label/medium` (16px) ou `font/size/label/small` (14px)
- Peso: `font/weight/regular` (400) ou `font/weight/semibold` (600)

**Texto de Tabela:**
- Dados do extrato → `font/size/paragraph/small` (14px)
- Peso: `font/weight/regular` (400)

### Border Radius

**Cards:**
- Estimado: 8px-12px → `shape/8` ou `shape/12`

**Botões:**
- Estimado: 8px → `shape/8`

**Inputs:**
- Estimado: 8px → `shape/8`

---

## 6️⃣ CONSIDERAÇÕES TÉCNICAS

### Integração com Supabase
- Tabelas necessárias: `transactions`, `cards`, `users`, `categories`
- Autenticação: Supabase Auth
- Real-time: Supabase Realtime para atualizações em tempo real

### Bibliotecas de Gráficos
- Sugestão: `recharts` ou `chart.js` com `react-chartjs-2`
- Componentes: DonutChart, AreaChart

### Formatação
- Moeda: `Intl.NumberFormat` para R$ (BRL)
- Data: `Intl.DateTimeFormat` para formato brasileiro
- Números: Funções utilitárias em `utils/`

### Performance
- Lazy loading de páginas
- Memoização de componentes pesados (gráficos, tabelas)
- Virtualização da tabela de extrato (se muitos registros)

### Acessibilidade
- Touch targets mínimos: 44x44px
- Contraste de cores: WCAG AA
- Navegação por teclado
- Screen readers

---

## ✅ CONCLUSÃO

Análise completa realizada com:
- ✅ Mapeamento de todos os componentes visuais
- ✅ Identificação de todas as variáveis do design system
- ✅ Estrutura de navegação definida
- ✅ Arquitetura proposta e validada
- ✅ Mapeamento de tokens Figma → Código

**Pronto para iniciar implementação!**

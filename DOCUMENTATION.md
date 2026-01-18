# mycash+ — Documentação

## Progresso

- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [ ] PROMPT 3: Sistema de Layout e Navegação Mobile
- [ ] PROMPT 4: Context Global e Gerenciamento de Estado
- [ ] PROMPT 5: Cards de Resumo Financeiro
- [ ] PROMPT 6: Header do Dashboard com Controles
- [ ] PROMPT 7: Carrossel de Gastos por Categoria
- [ ] PROMPT 8: Gráfico de Fluxo Financeiro
- [ ] PROMPT 9: Widget de Cartões de Crédito
- [ ] PROMPT 10: Widget de Próximas Despesas
- [ ] PROMPT 11: Tabela de Transações Detalhada
- [ ] PROMPT 12: Modal de Nova Transação
- [ ] PROMPT 13: Modal de Adicionar Membro
- [ ] PROMPT 14: Modal de Adicionar Cartão
- [ ] PROMPT 15: Modal de Detalhes do Cartão
- [ ] PROMPT 16: Modal de Filtros Mobile
- [ ] PROMPT 17: View Completa de Cartões
- [ ] PROMPT 18: View Completa de Transações
- [ ] PROMPT 19: View de Perfil - Aba Informações
- [ ] PROMPT 20: View de Perfil - Aba Configurações
- [ ] PROMPT 21: Animações e Transições Globais
- [ ] PROMPT 22: Formatação e Utilitários
- [ ] PROMPT 23: Responsividade e Ajustes Finais
- [ ] PROMPT 24: Testes e Validação Final
- [ ] PROMPT FINAL: Revisão e Entrega

---

## PROMPT 0: Análise e Planejamento Inicial

**Status:** ✅ | **Data:** 2025-01-XX | **Build:** N/A (análise)

### Implementado
- Análise completa do design do dashboard
- Mapeamento de todos os componentes visuais
- Identificação de variáveis do design system
- Estrutura de navegação definida
- Arquitetura proposta e validada
- Mapeamento de tokens Figma → Código
- Criação de sequência de prompts (1-20)
- Criação de TODO list

### Tokens Identificados

**Cores Primitivas:**
- Neutral: `color/neutral/0` até `color/neutral/1100`
- Brand: `color/brand/100` até `color/brand/1000`
- Green: `color/green/100` até `color/green/1000` (para receitas)
- Red: `color/red/100` até `color/red/1000` (para despesas)
- Purple, Pink, Orange, Yellow, Blue: Escalas completas

**Espaçamentos:**
- `space/0` até `space/128` (valores positivos)
- `space/negative/2` até `space/negative/48` (valores negativos)

**Tamanhos:**
- `size/0` até `size/1440`

**Shape (Border Radius):**
- `shape/0` até `shape/100`

**Tipografia:**
- Display: Large (96px), Medium (64px), Small (44px), XSmall (36px)
- Heading: XXLarge (40px) até XSmall (20px)
- Label: Large (18px) até XSmall (12px)
- Paragraph: Large (18px) até XSmall (12px)
- Weights: Bold (700), Semibold (600), Regular (400)

**Sombras:**
- Cores: Neutral e Brand com opacidades variadas
- Offsets: X (left/right) e Y (up/down) de 0 até 32
- Blur: 0 até 32
- Spread: 0 até 4

### Conversões Realizadas
- Análise baseada na descrição da imagem do dashboard
- Mapeamento de cores do design para tokens primitivos
- Identificação de espaçamentos padrão por breakpoint
- Mapeamento de tipografia do design para tokens

### Arquivos Criados
- `ANALYSIS_PROMPT_0.md` - Análise completa
- `SEQUENCE_PROMPTS.md` - Sequência de todos os prompts (1-20)
- `DOCUMENTATION.md` - Este arquivo

### Build
N/A - Análise e planejamento, sem código ainda

### Próximos Passos
⏭️ PROMPT 1: Estrutura Base do Projeto

---

## PROMPT 1: Estrutura Base e Configuração

**Status:** ✅ | **Data:** 2025-01-XX | **Build:** ✅ (2 tentativas)

### Implementado
- Estrutura de pastas completa (components, contexts, hooks, types, utils, constants, pages, styles)
- Subpastas organizadas em components por domínio (ui, layout, features/{dashboard, cards, transactions, profile, modals})
- Tailwind CSS configurado com variáveis do Figma
- Tokens semânticos e primitivos mapeados no Tailwind config
- Tipos TypeScript criados: Transaction, Goal, CreditCard, BankAccount, FamilyMember
- React Router configurado com 5 rotas principais (Dashboard, Cards, Transactions, Goals, Profile)
- SPA implementada com navegação funcional
- CSS Variables criadas a partir do variables.json do Figma
- Arquivos de configuração (package.json, vite.config.ts, tsconfig.json, tailwind.config.ts)
- Páginas placeholder criadas
- README.md criado
- Constantes do sistema criadas

### Tokens Utilizados

**Semânticas:** (preparadas para uso futuro)
- Cores: Brand (azul principal), Success (verde), Danger (vermelho)
- Espaçamentos: Container padding, gap entre elementos
- Tipografia: Títulos, valores, labels, parágrafos

**Primitivas:**
- Cores: `color-neutral-*`, `color-brand-*`, `color-green-*`, `color-red-*`, `color-purple-*`, `color-pink-*`, `color-orange-*`, `color-yellow-*`, `color-blue-*`
- Espaçamentos: `space-0` até `space-128` (valores diretos no Tailwind)
- Shapes: `border-radius-0` até `border-radius-100`
- Tipografia: Tamanhos e pesos mapeados
- Sombras: Sistema completo de sombras

### Conversões Realizadas
- Todas as variáveis do `variables.json` convertidas para CSS Variables
- Cores mapeadas no Tailwind config
- Espaçamentos integrados ao sistema de spacing do Tailwind
- Border radius integrado ao sistema de borderRadius do Tailwind

### Arquivos Criados
- `package.json` - Dependências do projeto
- `vite.config.ts` - Configuração do Vite
- `tsconfig.json` e `tsconfig.node.json` - Configuração TypeScript
- `tailwind.config.ts` - Configuração Tailwind com tokens
- `postcss.config.js` - Configuração PostCSS
- `.eslintrc.cjs` - Configuração ESLint
- `.gitignore` - Arquivos ignorados
- `index.html` - HTML base
- `src/styles/variables.css` - CSS Variables do design system
- `src/styles/globals.css` - Estilos globais
- `src/types/index.ts` - Tipos TypeScript fundamentais
- `src/main.tsx` - Entry point React
- `src/App.tsx` - Componente raiz com roteamento
- `src/pages/DashboardPage.tsx` - Página Dashboard
- `src/pages/CardsPage.tsx` - Página Cartões
- `src/pages/TransactionsPage.tsx` - Página Transações
- `src/pages/GoalsPage.tsx` - Página Objetivos
- `src/pages/ProfilePage.tsx` - Página Perfil
- `src/constants/index.ts` - Constantes do sistema
- `README.md` - Documentação do projeto

### Build
✅ Sucesso (tentativas: 2)
- Primeira tentativa: Sucesso
- Segunda tentativa: Sucesso após ajustes de classes Tailwind

### Próximos Passos
⏭️ PROMPT 2: Sistema de Layout e Navegação Desktop

---

## PROMPT 2: Sistema de Layout e Navegação Desktop

**Status:** ✅ | **Data:** 2025-01-XX | **Build:** ✅ (2 tentativas)

### Implementado
- Componente Sidebar com altura total do viewport (h-screen)
- Estado expandido: logo completo "mycash+", nomes das seções, perfil completo com nome e email
- Estado colapsado: apenas ícone do logo, ícones das seções, apenas avatar do perfil
- Botão circular na borda direita para alternar estados (ícone muda: chevron-left/right)
- Transições suaves entre estados (duration-300 ease-in-out)
- Ajuste fluido da margem esquerda do conteúdo principal via spacer div
- Sistema de tooltip que aparece ao passar mouse quando colapsado (delay de 300ms)
- Item ativo com fundo preto (bg-neutral-1100), texto branco e ícone verde-limão (#15BE78)
- Hook useSidebar para gerenciar estado (com persistência em localStorage)
- Componente Layout que integra Sidebar e Outlet do React Router
- Componentes UI base: Icon e Avatar
- Responsividade: Sidebar apenas em desktop (≥1280px via lg:), não renderiza em <1280px

### Tokens Utilizados

**Semânticas:**
- Cores: Brand (azul para logo), Success (verde-limão para ícone ativo)
- Espaçamentos: Container padding (px-6), gaps entre elementos

**Primitivas:**
- Cores: `neutral-0` (branco), `neutral-1100` (preto), `neutral-200` (hover), `neutral-300` (bordas), `neutral-600` (texto inativo), `neutral-900` (tooltip), `green-600` (ícone ativo), `brand-500` (logo)
- Espaçamentos: `px-4`, `px-6`, `py-4`, `mb-1`, `mr-3`, `h-12`, `h-16`, `w-64` (expandido), `w-20` (colapsado)
- Shapes: `rounded-lg`, `rounded-full`
- Tipografia: `text-sm`, `text-lg`, `font-medium`, `font-semibold`, `font-bold`
- Sombras: `shadow-lg` (botão toggle e tooltip)

### Conversões Realizadas
- Nenhuma conversão necessária - todos os valores usam tokens primitivos do design system

### Arquivos Criados
- `src/hooks/useSidebar.ts` - Hook para gerenciar estado expandido/colapsado
- `src/components/ui/Icon/Icon.tsx` - Componente de ícones SVG
- `src/components/ui/Icon/index.ts` - Export do Icon
- `src/components/ui/Avatar/Avatar.tsx` - Componente de avatar
- `src/components/ui/Avatar/index.ts` - Export do Avatar
- `src/components/layout/Sidebar/Sidebar.tsx` - Componente principal da Sidebar
- `src/components/layout/Sidebar/SidebarLogo.tsx` - Logo da Sidebar
- `src/components/layout/Sidebar/SidebarNavItem.tsx` - Item de navegação com tooltip
- `src/components/layout/Sidebar/SidebarUserInfo.tsx` - Informações do usuário
- `src/components/layout/Sidebar/index.ts` - Exports da Sidebar
- `src/components/layout/Layout.tsx` - Layout wrapper com Sidebar e Outlet
- `src/components/layout/index.ts` - Exports do layout
- `src/styles/globals.css` - Adicionada animação fadeIn para tooltip

### Arquivos Modificados
- `src/App.tsx` - Integrado Layout com React Router
- `src/pages/*.tsx` - Ajustado para remover min-h-screen duplicado

### Build
✅ Sucesso (tentativas: 2)
- Primeira tentativa: Erros TypeScript (imports não usados, tipos)
- Segunda tentativa: ✅ Sucesso após correções

### Requisitos de Responsividade
- Desktop (≥1280px): Sidebar visível com estados expandido/colapsado
- Tablet (<1280px): Sidebar não renderiza (hidden lg:flex)
- Mobile (<1280px): Sidebar não renderiza

---

## PROMPT 3: Sistema de Layout e Navegação Mobile

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar Header Mobile que substitui sidebar em viewports <1024px, com MenuDropdown e animações.

### Tarefas
- [ ] Criar HeaderMobile fixo no topo
- [ ] Logo "mycash+" à esquerda
- [ ] Avatar clicável à direita
- [ ] MenuDropdown que desliza de cima para baixo
- [ ] Lista de itens de navegação no dropdown
- [ ] Item ativo destacado com fundo preto
- [ ] Botão "Sair" vermelho no final
- [ ] Lógica de fechamento (clique em item, X, ou fora)
- [ ] Overlay escuro semi-transparente
- [ ] Breakpoints corretos (sidebar desktop ≥1024px, header mobile <1024px)

### Requisitos de Responsividade
- Desktop (≥1024px): Apenas sidebar
- Tablet (641-1023px): Apenas header mobile
- Mobile (≤640px): Apenas header mobile

---

## PROMPT 4: Context Global e Gerenciamento de Estado

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Criar FinanceProvider com estado global, funções CRUD, filtros e cálculos derivados.

### Tarefas
- [ ] Criar FinanceProvider no nível mais alto
- [ ] Arrays: transactions, goals, creditCards, bankAccounts, familyMembers
- [ ] Funções CRUD para cada entidade
- [ ] Estados de filtros: selectedMember, dateRange, transactionType, searchText
- [ ] Funções de cálculo: getFilteredTransactions, calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod, calculateExpensesByCategory, calculateCategoryPercentage, calculateSavingsRate
- [ ] Hook useFinance para acesso ao contexto
- [ ] Dados mock iniciais realistas (3 membros, 3 cartões, 20-30 transações, 4 objetivos)

### ⚠️ REGRA CRÍTICA
NÃO usar localStorage, sessionStorage ou browser storage API. Apenas React state (useState, useReducer).

---

## PROMPT 5: Cards de Resumo Financeiro

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar BalanceCard, IncomeCard e ExpenseCard com animações de contagem.

### Tarefas
- [ ] BalanceCard: fundo preto, círculo verde-limão desfocado, badge de crescimento
- [ ] IncomeCard: fundo branco, ícone seta baixo-esquerda, valor de receitas
- [ ] ExpenseCard: fundo branco, ícone seta cima-direita vermelho, valor de despesas
- [ ] Animações de contagem nos valores (800ms)
- [ ] Layout responsivo (horizontal desktop, vertical mobile)
- [ ] Usar variáveis do design system

---

## PROMPT 6: Header do Dashboard com Controles

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar barra de controles com busca, filtros, seletor de período e widget de membros.

### Tarefas
- [ ] Campo de busca com ícone de lupa (busca em tempo real)
- [ ] Botão de filtros (popover desktop, modal mobile)
- [ ] FilterPopover: tipo de transação (rádio), seletor de período (calendário)
- [ ] Calendário interativo (2 meses desktop, 1 mês mobile)
- [ ] Atalhos: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano"
- [ ] Widget de membros: avatares sobrepostos, clique para filtrar
- [ ] Botão "Nova Transação" destacado
- [ ] Usar variáveis do design system

---

## PROMPT 7: Carrossel de Gastos por Categoria

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar carrossel horizontal com cards de categoria e gráficos donut.

### Tarefas
- [ ] ExpensesByCategoryCarousel processando dados do contexto
- [ ] CategoryDonutCard com gráfico donut (64px)
- [ ] Percentual centralizado no donut
- [ ] Nome da categoria e valor formatado
- [ ] Scroll horizontal (mouse wheel, drag, setas)
- [ ] Gradiente de máscara nas bordas
- [ ] Hover nos cards (borda verde-limão)
- [ ] Mobile: apenas scroll por toque

---

## PROMPT 8: Gráfico de Fluxo Financeiro

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar gráfico de área mostrando evolução de receitas e despesas ao longo dos meses.

### Tarefas
- [ ] FinancialFlowChart usando Recharts
- [ ] Título "Fluxo Financeiro" com ícone
- [ ] Legenda: círculo verde "Receitas", círculo preto "Despesas"
- [ ] Eixo X: meses abreviados (Jan, Fev, Mar...)
- [ ] Eixo Y: valores monetários compactos (R$ 2k, R$ 4k...)
- [ ] Grid horizontal tracejado
- [ ] Duas áreas: receitas (verde-limão) e despesas (preto)
- [ ] Tooltip interativo com linha vertical
- [ ] Dados mock para 7 meses

---

## PROMPT 9: Widget de Cartões de Crédito

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar widget que exibe lista de cartões de crédito com informações e interatividade.

### Tarefas
- [ ] CreditCardsWidget com fundo cinza claro
- [ ] Header: ícone, título "Cartões", botão "+"
- [ ] Lista vertical de cartões
- [ ] Cada card: ícone à esquerda, informações ao centro, badge de uso à direita
- [ ] Badge circular com percentual de uso
- [ ] Hover: elevação e sombra aumentada
- [ ] Clique abre modal de detalhes
- [ ] Paginação se mais de 3 cartões
- [ ] Mobile: suporte a swipe

---

## PROMPT 10: Widget de Próximas Despesas

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar widget com lista cronológica de contas a pagar.

### Tarefas
- [ ] Widget com fundo branco e borda clara
- [ ] Header: ícone carteira, título "Próximas despesas", botão "+"
- [ ] Lista de despesas pendentes ordenadas por data
- [ ] Cada item: descrição, data de vencimento, conta/cartão, valor, botão check
- [ ] Botão check: marca como paga, remove da lista, cria próxima ocorrência se recorrente
- [ ] Estado vazio: ícone check verde, mensagem, borda tracejada
- [ ] Animações de desaparecimento

---

## PROMPT 11: Tabela de Transações Detalhada

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar tabela completa de transações com busca, filtros e paginação.

### Tarefas
- [ ] TransactionsTable com header e controles
- [ ] Campo de busca local
- [ ] Select de tipo (Todos, Receitas, Despesas)
- [ ] 7 colunas: Avatar, Data, Descrição, Categoria, Conta/Cartão, Parcelas, Valor
- [ ] Zebra striping sutil
- [ ] Hover nas linhas
- [ ] Filtragem combinada (globais + locais)
- [ ] Ordenação por data decrescente
- [ ] Paginação (5 por página)
- [ ] Contador "Mostrando 1 a 5 de 47"
- [ ] Estado vazio quando sem resultados

---

## PROMPT 12: Modal de Nova Transação

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar modal completo para adicionar transações com validação.

### Tarefas
- [ ] Modal fullscreen com header, conteúdo scrollável e footer
- [ ] Toggle de tipo (Receita/Despesa)
- [ ] Campo de valor com "R$" fixo
- [ ] Campo de descrição
- [ ] Campo de categoria com botão "+ Nova Categoria"
- [ ] Grid: Select de membro e Select de conta/cartão
- [ ] Campo de parcelamento (condicional para cartão + despesa)
- [ ] Checkbox de despesa recorrente (condicional)
- [ ] Validação completa
- [ ] Botões Cancelar e Salvar
- [ ] Toast de sucesso

---

## PROMPT 13: Modal de Adicionar Membro

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar modal para adicionar membros da família.

### Tarefas
- [ ] Modal com estrutura padrão (header, conteúdo, footer)
- [ ] Campo nome completo (obrigatório, min 3 caracteres)
- [ ] Campo função/papel (combobox com sugestões)
- [ ] Campo avatar (URL ou Upload)
- [ ] Campo renda mensal (opcional, numérico)
- [ ] Validação
- [ ] Toast de sucesso
- [ ] Novo membro aparece imediatamente nos avatares

---

## PROMPT 14: Modal de Adicionar Cartão

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar modal para adicionar contas bancárias e cartões de crédito.

### Tarefas
- [ ] Modal centralizado
- [ ] Toggle de tipo (Conta Bancária / Cartão de Crédito)
- [ ] Campo nome
- [ ] Select de titular (membros da família)
- [ ] Campos condicionais para Conta: saldo inicial
- [ ] Campos condicionais para Cartão: fechamento, vencimento, limite, últimos 4 dígitos, tema visual
- [ ] Tema visual: 3 cards clicáveis (Black, Lime, White)
- [ ] Validação completa
- [ ] Toast de sucesso

---

## PROMPT 15: Modal de Detalhes do Cartão

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar modal que mostra informações completas do cartão.

### Tarefas
- [ ] Modal maior com header, conteúdo dividido
- [ ] Área de informações: limite, fatura, disponível, percentual, datas, dígitos
- [ ] Representação visual do uso (donut ou barra)
- [ ] Área de despesas: tabela de transações do cartão
- [ ] Paginação se muitas despesas
- [ ] Botões de ação: Ver Extrato, Adicionar Despesa, Editar Cartão, Fechar

---

## PROMPT 16: Modal de Filtros Mobile

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar modal de filtros específico para mobile com animação slide-in.

### Tarefas
- [ ] Modal que desliza de baixo para cima
- [ ] Header fixo: título "Filtros" e botão X
- [ ] Conteúdo scrollável
- [ ] Footer fixo: botão "Aplicar Filtros"
- [ ] Seção tipo de transação (grid 3 colunas)
- [ ] Seção membro da família (botões com avatares)
- [ ] Seção período (calendário)
- [ ] Estado temporário local
- [ ] Aplicar filtros ao contexto ao confirmar
- [ ] Fechar sem aplicar ao cancelar

---

## PROMPT 17: View Completa de Cartões

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar tela completa dedicada aos cartões de crédito.

### Tarefas
- [ ] CardsView como seção navegável
- [ ] Header: título "Cartões de Crédito" e botão "Novo Cartão"
- [ ] Grid responsivo (1 mobile, 2 tablet, 3 desktop)
- [ ] Cards grandes e detalhados
- [ ] Informações: nome, valores, datas, tema, dígitos
- [ ] Botões de ação em cada card
- [ ] Estado vazio se sem cartões
- [ ] Ordenação por fatura ou alfabética

---

## PROMPT 18: View Completa de Transações

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar tela completa dedicada às transações com filtros avançados.

### Tarefas
- [ ] TransactionsView como seção navegável
- [ ] Header: título "Transações" e botão "Nova Transação"
- [ ] Barra de filtros avançados (busca, tipo, categoria, conta, membro, período, status)
- [ ] Linha de resumo (receitas, despesas, diferença, quantidade)
- [ ] Tabela expandida (10 por página)
- [ ] Ordenação clicável nos headers
- [ ] Botão "Exportar" (CSV/PDF)
- [ ] Estado vazio apropriado

---

## PROMPT 19: View de Perfil - Aba Informações

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar aba "Informações" da view de perfil.

### Tarefas
- [ ] ProfileView com sistema de abas
- [ ] Aba "Informações" ativa por padrão
- [ ] Seção de perfil: avatar, nome, função, email, renda
- [ ] Botão "Editar Perfil"
- [ ] Seção membros da família: lista de todos os membros
- [ ] Cada item: avatar, nome, função, renda
- [ ] Hover e clicável nos items
- [ ] Botão "Sair" vermelho

---

## PROMPT 20: View de Perfil - Aba Configurações

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar aba "Configurações" da view de perfil.

### Tarefas
- [ ] Aba "Configurações" com conteúdo
- [ ] Seção preferências de exibição: modo escuro, moeda, formato de data
- [ ] Seção notificações: múltiplos toggles
- [ ] Seção categorias: gerenciar categorias de receita e despesa
- [ ] Seção dados e privacidade: exportar, limpar dados
- [ ] Seção sobre: versão, links, texto descritivo
- [ ] Layout responsivo

---

## PROMPT 21: Animações e Transições Globais

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Implementar animações e transições suaves em todo o sistema.

### Tarefas
- [ ] Transições de navegação (fade-out/fade-in)
- [ ] Animações de entrada para cards (fade-in + slide-up com stagger)
- [ ] Animações de hover consistentes
- [ ] Animações de loading para valores monetários
- [ ] Animações de barras de progresso
- [ ] Animações de modais (abertura/fechamento)
- [ ] Animações de toasts
- [ ] Skeleton loaders
- [ ] Micro-interações (checkboxes, inputs, dropdowns)
- [ ] Respeitar prefers-reduced-motion

---

## PROMPT 22: Formatação e Utilitários

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Criar funções utilitárias para formatação consistente.

### Tarefas
- [ ] formatCurrency: moeda brasileira (R$ 1.234,56)
- [ ] formatCompactCurrency: valores compactos (R$ 2,5k)
- [ ] parseCurrencyInput: converter string para número
- [ ] formatDate: DD/MM/AAAA
- [ ] formatDateLong: extenso
- [ ] formatDateRange: intervalo formatado
- [ ] formatRelativeDate: relativo (Hoje, Ontem...)
- [ ] groupByCategory: agrupar transações
- [ ] filterByDateRange: filtrar por período
- [ ] sortByDate: ordenar por data
- [ ] calculatePercentage: calcular percentual
- [ ] calculateDifference: diferença e variação
- [ ] calculateInstallmentValue: valor de parcela
- [ ] Validações: email, CPF, data, número positivo
- [ ] generateUniqueId: gerar ID único
- [ ] JSDoc comments e testes unitários

---

## PROMPT 23: Responsividade e Ajustes Finais

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Revisão completa de responsividade com ajustes incrementais.

### Tarefas
- [ ] Validar breakpoints oficiais (mobile <768px, tablet 768-1279px, desktop 1280-1919px, wide ≥1920px)
- [ ] Garantir layout 100% fluido (width: 100%, max-width para limitação)
- [ ] Validar sidebar apenas desktop (≥1280px)
- [ ] Validar header mobile apenas <1280px
- [ ] Ajustar grids (1 mobile, 2 tablet, 3-4 desktop)
- [ ] Ajustar espaçamentos (px-4 mobile, px-6 tablet, px-8 desktop)
- [ ] Ajustar tipografia responsiva
- [ ] Tabela mobile-first (cards no mobile)
- [ ] Gráficos adaptativos
- [ ] Modais responsivos
- [ ] Touch targets mínimos (44x44px)
- [ ] Acessibilidade básica
- [ ] Validação em 375px, 768px, 1280px, 1920px

---

## PROMPT 24: Testes e Validação Final

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Finalizar com testes e validação completa do sistema.

### Tarefas
- [ ] Fluxo de teste completo (jornada de usuário)
- [ ] Validação de cálculos financeiros
- [ ] Validação de filtros combinados
- [ ] Validação de formatações (moeda, data, percentuais)
- [ ] Validação de responsividade
- [ ] Validação de modais
- [ ] Validação de acessibilidade (teclado, leitor de tela)
- [ ] Validação de performance
- [ ] Correção de bugs encontrados
- [ ] Tratamento de erros
- [ ] Mensagens de feedback
- [ ] Documentação de comportamentos
- [ ] README.md completo

---

## PROMPT FINAL: Revisão e Entrega

**Status:** ⏳ | **Data:** - | **Build:** -

### Objetivo
Revisão final e preparação para entrega do projeto.

### Tarefas
- [ ] Checklist completo de qualidade
- [ ] Revisão de organização do código
- [ ] Revisão de comentários e documentação
- [ ] Otimização de performance final
- [ ] Preparação para integração futura com Supabase
- [ ] Documentação de componentes principais
- [ ] Relatório final (componentes, linhas de código, funcionalidades)

---

*Documentação será atualizada conforme os prompts forem executados.*

# 📋 SEQUÊNCIA DE PROMPTS — mycash+ Dashboard

Este documento contém todos os prompts numerados para implementação sequencial do projeto.

**Total de Prompts:** 25 (PROMPT 0 + PROMPT 1-24 + PROMPT FINAL)

---

## 📋 PROMPT 0: Análise e Planejamento Inicial ✅

**Status:** CONCLUÍDO

**Objetivo:** Análise completa do projeto, mapeamento de componentes, variáveis e arquitetura.

**Entregas:**
- Mapeamento de componentes visuais
- Identificação de variáveis do design system
- Estrutura de navegação
- Arquitetura proposta
- Mapeamento de tokens

**Documento:** `ANALYSIS_PROMPT_0.md`

---

## 🏗️ PROMPT 1: Estrutura Base e Configuração

**Objetivo:** Criar estrutura base do projeto com pastas organizadas, configurar Tailwind CSS com variáveis do Figma, criar tipos TypeScript fundamentais e configurar React Router.

**Tarefas Principais:**
- Configurar estrutura de pastas (components, contexts, hooks, types, utils, constants)
- Organizar subpastas em components por domínio (layout, dashboard, cards, modals)
- Configurar Tailwind CSS para reconhecer variáveis do Figma
- Mapear tokens semânticos e primitivos no Tailwind config
- Criar tipos TypeScript: Transaction, Goal, CreditCard, BankAccount, FamilyMember
- Configurar React Router com 5 rotas principais
- Implementar SPA com navegação que mantém estrutura visível

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

---

## 🎨 PROMPT 2: Sistema de Layout e Navegação Desktop

**Objetivo:** Implementar Sidebar desktop com estados expandido/colapsado, tooltips e transições suaves.

**Tarefas Principais:**
- Criar componente Sidebar com altura total do viewport
- Implementar estado expandido (logo completo, nomes, perfil completo)
- Implementar estado colapsado (apenas ícones)
- Botão circular na borda direita para alternar estados
- Transições suaves entre estados
- Ajuste fluido da margem esquerda do conteúdo principal
- Sistema de tooltip para itens quando colapsado
- Item ativo com fundo preto, texto branco e ícone verde-limão

**Requisitos de Responsividade:**
- Desktop (≥1024px): Sidebar visível
- Tablet (641-1023px): Sidebar não renderiza
- Mobile (≤640px): Sidebar não renderiza

---

## 📱 PROMPT 3: Sistema de Layout e Navegação Mobile

**Objetivo:** Implementar Header Mobile que substitui sidebar em viewports <1024px, com MenuDropdown e animações.

**Tarefas Principais:**
- Criar HeaderMobile fixo no topo
- Logo "mycash+" à esquerda
- Avatar clicável à direita
- MenuDropdown que desliza de cima para baixo
- Lista de itens de navegação no dropdown
- Item ativo destacado com fundo preto
- Botão "Sair" vermelho no final
- Lógica de fechamento (clique em item, X, ou fora)
- Overlay escuro semi-transparente
- Breakpoints corretos (sidebar desktop ≥1024px, header mobile <1024px)

---

## 💾 PROMPT 4: Context Global e Gerenciamento de Estado

**Objetivo:** Criar FinanceProvider com estado global, funções CRUD, filtros e cálculos derivados.

**⚠️ REGRA CRÍTICA:** NÃO usar localStorage, sessionStorage ou browser storage API. Apenas React state (useState, useReducer).

**Tarefas Principais:**
- Criar FinanceProvider no nível mais alto
- Arrays: transactions, goals, creditCards, bankAccounts, familyMembers
- Funções CRUD para cada entidade
- Estados de filtros: selectedMember, dateRange, transactionType, searchText
- Funções de cálculo: getFilteredTransactions, calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod, calculateExpensesByCategory, calculateCategoryPercentage, calculateSavingsRate
- Hook useFinance para acesso ao contexto
- Dados mock iniciais realistas (3 membros, 3 cartões, 20-30 transações, 4 objetivos)

---

## 📊 PROMPT 5: Cards de Resumo Financeiro

**Objetivo:** Implementar BalanceCard, IncomeCard e ExpenseCard com animações de contagem.

**Tarefas Principais:**
- BalanceCard: fundo preto, círculo verde-limão desfocado, badge de crescimento
- IncomeCard: fundo branco, ícone seta baixo-esquerda, valor de receitas
- ExpenseCard: fundo branco, ícone seta cima-direita vermelho, valor de despesas
- Animações de contagem nos valores (800ms)
- Layout responsivo (horizontal desktop, vertical mobile)

---

## 🎯 PROMPT 6: Header do Dashboard com Controles

**Objetivo:** Implementar barra de controles com busca, filtros, seletor de período e widget de membros.

**Tarefas Principais:**
- Campo de busca com ícone de lupa (busca em tempo real)
- Botão de filtros (popover desktop, modal mobile)
- FilterPopover: tipo de transação (rádio), seletor de período (calendário)
- Calendário interativo (2 meses desktop, 1 mês mobile)
- Atalhos: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano"
- Widget de membros: avatares sobrepostos, clique para filtrar
- Botão "Nova Transação" destacado

---

## 🍩 PROMPT 7: Carrossel de Gastos por Categoria

**Objetivo:** Implementar carrossel horizontal com cards de categoria e gráficos donut.

**Tarefas Principais:**
- ExpensesByCategoryCarousel processando dados do contexto
- CategoryDonutCard com gráfico donut (64px)
- Percentual centralizado no donut
- Nome da categoria e valor formatado
- Scroll horizontal (mouse wheel, drag, setas)
- Gradiente de máscara nas bordas
- Hover nos cards (borda verde-limão)
- Mobile: apenas scroll por toque

---

## 📈 PROMPT 8: Gráfico de Fluxo Financeiro

**Objetivo:** Implementar gráfico de área mostrando evolução de receitas e despesas ao longo dos meses.

**Tarefas Principais:**
- FinancialFlowChart usando Recharts
- Título "Fluxo Financeiro" com ícone
- Legenda: círculo verde "Receitas", círculo preto "Despesas"
- Eixo X: meses abreviados (Jan, Fev, Mar...)
- Eixo Y: valores monetários compactos (R$ 2k, R$ 4k...)
- Grid horizontal tracejado
- Duas áreas: receitas (verde-limão) e despesas (preto)
- Tooltip interativo com linha vertical
- Dados mock para 7 meses

---

## 💳 PROMPT 9: Widget de Cartões de Crédito

**Objetivo:** Implementar widget que exibe lista de cartões de crédito com informações e interatividade.

**Tarefas Principais:**
- CreditCardsWidget com fundo cinza claro
- Header: ícone, título "Cartões", botão "+"
- Lista vertical de cartões
- Cada card: ícone à esquerda, informações ao centro, badge de uso à direita
- Badge circular com percentual de uso
- Hover: elevação e sombra aumentada
- Clique abre modal de detalhes
- Paginação se mais de 3 cartões
- Mobile: suporte a swipe

---

## 📋 PROMPT 10: Widget de Próximas Despesas

**Objetivo:** Implementar widget com lista cronológica de contas a pagar.

**Tarefas Principais:**
- Widget com fundo branco e borda clara
- Header: ícone carteira, título "Próximas despesas", botão "+"
- Lista de despesas pendentes ordenadas por data
- Cada item: descrição, data de vencimento, conta/cartão, valor, botão check
- Botão check: marca como paga, remove da lista, cria próxima ocorrência se recorrente
- Estado vazio: ícone check verde, mensagem, borda tracejada
- Animações de desaparecimento

---

## 📋 PROMPT 11: Tabela de Transações Detalhada

**Objetivo:** Implementar tabela completa de transações com busca, filtros e paginação.

**Tarefas Principais:**
- TransactionsTable com header e controles
- Campo de busca local
- Select de tipo (Todos, Receitas, Despesas)
- 7 colunas: Avatar, Data, Descrição, Categoria, Conta/Cartão, Parcelas, Valor
- Zebra striping sutil
- Hover nas linhas
- Filtragem combinada (globais + locais)
- Ordenação por data decrescente
- Paginação (5 por página)
- Contador "Mostrando 1 a 5 de 47"
- Estado vazio quando sem resultados

---

## 📋 PROMPT 12: Modal de Nova Transação

**Objetivo:** Implementar modal completo para adicionar transações com validação.

**Tarefas Principais:**
- Modal fullscreen com header, conteúdo scrollável e footer
- Toggle de tipo (Receita/Despesa)
- Campo de valor com "R$" fixo
- Campo de descrição
- Campo de categoria com botão "+ Nova Categoria"
- Grid: Select de membro e Select de conta/cartão
- Campo de parcelamento (condicional para cartão + despesa)
- Checkbox de despesa recorrente (condicional)
- Validação completa
- Botões Cancelar e Salvar
- Toast de sucesso

---

## 👥 PROMPT 13: Modal de Adicionar Membro

**Objetivo:** Implementar modal para adicionar membros da família.

**Tarefas Principais:**
- Modal com estrutura padrão (header, conteúdo, footer)
- Campo nome completo (obrigatório, min 3 caracteres)
- Campo função/papel (combobox com sugestões)
- Campo avatar (URL ou Upload)
- Campo renda mensal (opcional, numérico)
- Validação
- Toast de sucesso
- Novo membro aparece imediatamente nos avatares

---

## 💳 PROMPT 14: Modal de Adicionar Cartão

**Objetivo:** Implementar modal para adicionar contas bancárias e cartões de crédito.

**Tarefas Principais:**
- Modal centralizado
- Toggle de tipo (Conta Bancária / Cartão de Crédito)
- Campo nome
- Select de titular (membros da família)
- Campos condicionais para Conta: saldo inicial
- Campos condicionais para Cartão: fechamento, vencimento, limite, últimos 4 dígitos, tema visual
- Tema visual: 3 cards clicáveis (Black, Lime, White)
- Validação completa
- Toast de sucesso

---

## 📊 PROMPT 15: Modal de Detalhes do Cartão

**Objetivo:** Implementar modal que mostra informações completas do cartão.

**Tarefas Principais:**
- Modal maior com header, conteúdo dividido
- Área de informações: limite, fatura, disponível, percentual, datas, dígitos
- Representação visual do uso (donut ou barra)
- Área de despesas: tabela de transações do cartão
- Paginação se muitas despesas
- Botões de ação: Ver Extrato, Adicionar Despesa, Editar Cartão, Fechar

---

## 📱 PROMPT 16: Modal de Filtros Mobile

**Objetivo:** Implementar modal de filtros específico para mobile com animação slide-in.

**Tarefas Principais:**
- Modal que desliza de baixo para cima
- Header fixo: título "Filtros" e botão X
- Conteúdo scrollável
- Footer fixo: botão "Aplicar Filtros"
- Seção tipo de transação (grid 3 colunas)
- Seção membro da família (botões com avatares)
- Seção período (calendário)
- Estado temporário local
- Aplicar filtros ao contexto ao confirmar
- Fechar sem aplicar ao cancelar

---

## 💳 PROMPT 17: View Completa de Cartões

**Objetivo:** Implementar tela completa dedicada aos cartões de crédito.

**Tarefas Principais:**
- CardsView como seção navegável
- Header: título "Cartões de Crédito" e botão "Novo Cartão"
- Grid responsivo (1 mobile, 2 tablet, 3 desktop)
- Cards grandes e detalhados
- Informações: nome, valores, datas, tema, dígitos
- Botões de ação em cada card
- Estado vazio se sem cartões
- Ordenação por fatura ou alfabética

---

## 📋 PROMPT 18: View Completa de Transações

**Objetivo:** Implementar tela completa dedicada às transações com filtros avançados.

**Tarefas Principais:**
- TransactionsView como seção navegável
- Header: título "Transações" e botão "Nova Transação"
- Barra de filtros avançados (busca, tipo, categoria, conta, membro, período, status)
- Linha de resumo (receitas, despesas, diferença, quantidade)
- Tabela expandida (10 por página)
- Ordenação clicável nos headers
- Botão "Exportar" (CSV/PDF)
- Estado vazio apropriado

---

## 👤 PROMPT 19: View de Perfil - Aba Informações

**Objetivo:** Implementar aba "Informações" da view de perfil.

**Tarefas Principais:**
- ProfileView com sistema de abas
- Aba "Informações" ativa por padrão
- Seção de perfil: avatar, nome, função, email, renda
- Botão "Editar Perfil"
- Seção membros da família: lista de todos os membros
- Cada item: avatar, nome, função, renda
- Hover e clicável nos items
- Botão "Sair" vermelho

---

## ⚙️ PROMPT 20: View de Perfil - Aba Configurações

**Objetivo:** Implementar aba "Configurações" da view de perfil.

**Tarefas Principais:**
- Aba "Configurações" com conteúdo
- Seção preferências de exibição: modo escuro, moeda, formato de data
- Seção notificações: múltiplos toggles
- Seção categorias: gerenciar categorias de receita e despesa
- Seção dados e privacidade: exportar, limpar dados
- Seção sobre: versão, links, texto descritivo
- Layout responsivo

---

## 🎨 PROMPT 21: Animações e Transições Globais

**Objetivo:** Implementar animações e transições suaves em todo o sistema.

**Tarefas Principais:**
- Transições de navegação (fade-out/fade-in)
- Animações de entrada para cards (fade-in + slide-up com stagger)
- Animações de hover consistentes
- Animações de loading para valores monetários
- Animações de barras de progresso
- Animações de modais (abertura/fechamento)
- Animações de toasts
- Skeleton loaders
- Micro-interações (checkboxes, inputs, dropdowns)
- Respeitar prefers-reduced-motion

---

## 🎯 PROMPT 22: Formatação e Utilitários

**Objetivo:** Criar funções utilitárias para formatação consistente.

**Tarefas Principais:**
- formatCurrency: moeda brasileira (R$ 1.234,56)
- formatCompactCurrency: valores compactos (R$ 2,5k)
- parseCurrencyInput: converter string para número
- formatDate: DD/MM/AAAA
- formatDateLong: extenso
- formatDateRange: intervalo formatado
- formatRelativeDate: relativo (Hoje, Ontem...)
- groupByCategory: agrupar transações
- filterByDateRange: filtrar por período
- sortByDate: ordenar por data
- calculatePercentage: calcular percentual
- calculateDifference: diferença e variação
- calculateInstallmentValue: valor de parcela
- Validações: email, CPF, data, número positivo
- generateUniqueId: gerar ID único
- JSDoc comments e testes unitários

---

## 🎨 PROMPT 23: Responsividade e Ajustes Finais

**Objetivo:** Revisão completa de responsividade com ajustes incrementais.

**Tarefas Principais:**
- Validar breakpoints oficiais (mobile <768px, tablet 768-1279px, desktop 1280-1919px, wide ≥1920px)
- Garantir layout 100% fluido (width: 100%, max-width para limitação)
- Validar sidebar apenas desktop (≥1280px)
- Validar header mobile apenas <1280px
- Ajustar grids (1 mobile, 2 tablet, 3-4 desktop)
- Ajustar espaçamentos (px-4 mobile, px-6 tablet, px-8 desktop)
- Ajustar tipografia responsiva
- Tabela mobile-first (cards no mobile)
- Gráficos adaptativos
- Modais responsivos
- Touch targets mínimos (44x44px)
- Acessibilidade básica
- Validação em 375px, 768px, 1280px, 1920px

---

## ✅ PROMPT 24: Testes e Validação Final

**Objetivo:** Finalizar com testes e validação completa do sistema.

**Tarefas Principais:**
- Fluxo de teste completo (jornada de usuário)
- Validação de cálculos financeiros
- Validação de filtros combinados
- Validação de formatações (moeda, data, percentuais)
- Validação de responsividade
- Validação de modais
- Validação de acessibilidade (teclado, leitor de tela)
- Validação de performance
- Correção de bugs encontrados
- Tratamento de erros
- Mensagens de feedback
- Documentação de comportamentos
- README.md completo

---

## 🎉 PROMPT FINAL: Revisão e Entrega

**Objetivo:** Revisão final e preparação para entrega do projeto.

**Tarefas Principais:**
- Checklist completo de qualidade
- Revisão de organização do código
- Revisão de comentários e documentação
- Otimização de performance final
- Preparação para integração futura com Supabase
- Documentação de componentes principais
- Relatório final (componentes, linhas de código, funcionalidades)

---

## 📊 RESUMO

**Total de Prompts:** 25 (PROMPT 0 + PROMPT 1-24 + PROMPT FINAL)

**Status:**
- ✅ PROMPT 0: Concluído
- ⏳ PROMPT 1-24: Pendentes
- ⏳ PROMPT FINAL: Pendente

**Ordem de Execução:**
1. PROMPT 1-3: Estrutura base e navegação
2. PROMPT 4: Context global e estado
3. PROMPT 5-11: Dashboard completo
4. PROMPT 12-16: Modais
5. PROMPT 17-20: Views completas
6. PROMPT 21-22: Animações e utilitários
7. PROMPT 23-24: Responsividade e testes
8. PROMPT FINAL: Revisão e entrega

---

**Próximo passo:** Executar PROMPT 1

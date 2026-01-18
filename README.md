# mycash+ - Gestão Financeira Familiar

Sistema de gestão financeira familiar desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** com **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **React Router** - Roteamento SPA
- **Recharts** - Gráficos e visualizações

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📁 Estrutura de Pastas

```
src/
├── components/        # Componentes React
│   ├── ui/           # Componentes UI base (Button, Input, Card, etc)
│   ├── layout/       # Componentes de layout (Sidebar, Header, etc)
│   └── features/     # Componentes de features (Dashboard, Cards, etc)
├── contexts/         # React Contexts (FinanceProvider, etc)
├── hooks/            # Custom hooks
├── types/            # Definições TypeScript
├── utils/            # Funções utilitárias
├── constants/        # Constantes do sistema
├── pages/            # Páginas (Dashboard, Cards, Transactions, etc)
└── styles/           # Estilos globais e variáveis CSS
```

## 🎨 Design System

O projeto utiliza variáveis CSS do design system do Figma, mapeadas em `src/styles/variables.css` e integradas ao Tailwind via `tailwind.config.ts`.

### Breakpoints

- **Mobile (base):** < 768px
- **Tablet (md):** ≥ 768px e < 1280px
- **Desktop (lg):** ≥ 1280px e < 1920px
- **Wide / 4K (xl):** ≥ 1920px

### Tokens Disponíveis

- **Cores:** Neutral, Brand, Green, Red, Purple, Pink, Orange, Yellow, Blue
- **Espaçamentos:** 0px até 128px
- **Tipografia:** Display, Heading, Label, Paragraph
- **Shapes:** Border radius de 0px até 100px
- **Sombras:** Sistema completo de sombras

## 🗺️ Rotas

- `/` - Dashboard
- `/cards` - Cartões de Crédito
- `/transactions` - Transações
- `/goals` - Objetivos
- `/profile` - Perfil

## 📝 Tipos TypeScript

O sistema trabalha com 5 entidades principais:

- `Transaction` - Transações financeiras
- `Goal` - Objetivos financeiros
- `CreditCard` - Cartões de crédito
- `BankAccount` - Contas bancárias
- `FamilyMember` - Membros da família

## 🔄 Próximos Passos

Consulte `SEQUENCE_PROMPTS.md` para ver a sequência completa de implementação.

## 📄 Licença

Este projeto é privado.

/**
 * Constantes do sistema mycash+
 */

export const ROUTES = {
  DASHBOARD: '/',
  CARDS: '/cards',
  TRANSACTIONS: '/transactions',
  GOALS: '/goals',
  PROFILE: '/profile',
} as const

export const NAVIGATION_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'home' },
  { path: ROUTES.GOALS, label: 'Objetivos', icon: 'target' },
  { path: ROUTES.CARDS, label: 'Cartões', icon: 'credit-card' },
  { path: ROUTES.TRANSACTIONS, label: 'Transações', icon: 'list' },
  { path: ROUTES.PROFILE, label: 'Perfil', icon: 'user' },
] as const

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Aluguel Recebido',
    'Outros',
  ],
  EXPENSE: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Roupas',
    'Contas',
    'Outros',
  ],
} as const

export const CREDIT_CARD_THEMES = ['black', 'lime', 'white'] as const

export const DATE_FORMAT = 'DD/MM/YYYY'
export const CURRENCY_FORMAT = 'pt-BR'
export const CURRENCY_CODE = 'BRL'

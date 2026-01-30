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

/**
 * Limites de upload para plano Supabase gratuito (uso modesto de storage).
 * Avatares: 512 KB. Thumbs de objetivos: 256 KB.
 */
export const STORAGE_MAX_AVATAR_BYTES = 512 * 1024 // 512 KB
export const STORAGE_MAX_GOAL_THUMB_BYTES = 256 * 1024 // 256 KB

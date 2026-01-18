/**
 * Utilitários para formatação de datas
 */

const monthNames = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]


/**
 * Formata data para "DD mmm YYYY" (ex: "01 jan 2026")
 */
export function formatDateShort(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Formata intervalo de datas para "DD mmm - DD mmm, YYYY" (ex: "01 jan - 31 jan, 2026")
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = startDate.getDate().toString().padStart(2, '0')
  const startMonth = monthNames[startDate.getMonth()]
  const endDay = endDate.getDate().toString().padStart(2, '0')
  const endMonth = monthNames[endDate.getMonth()]
  const year = startDate.getFullYear()

  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
}

/**
 * Retorna o primeiro e último dia do mês atual
 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start, end }
}

/**
 * Retorna o primeiro e último dia do mês passado
 */
export function getLastMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const end = new Date(now.getFullYear(), now.getMonth(), 0)
  return { start, end }
}

/**
 * Retorna o primeiro e último dia dos últimos 3 meses
 */
export function getLastThreeMonthsRange(): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  return { start, end }
}

/**
 * Retorna o primeiro e último dia do ano atual
 */
export function getCurrentYearRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear(), 11, 31)
  return { start, end }
}

/**
 * Formata data para "DD/MM/YYYY"
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

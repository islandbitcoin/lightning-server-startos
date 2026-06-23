export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Lightning Server!': 0,
  'Lightning Server is ready': 1,
  'Lightning Server is still starting. If this persists, please check the logs.': 2,
  'Web Interface': 3,
  'Dashboard for Lightning Address management, payment history, and configuration': 4,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict

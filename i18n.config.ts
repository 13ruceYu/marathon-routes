import en from './app/locales/en.json'
import zh from './app/locales/zh.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    zh,
  },
}))

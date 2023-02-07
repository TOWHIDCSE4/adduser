const NextI18Next = require('next-i18next').default

export default new NextI18Next({
  defaultNS: 'common',
  localePath: typeof window === 'undefined' ? 'public/static/locales' : 'static/locales',
  defaultLanguage: 'en',
  otherLanguages: ['en'],
  serverLanguageDetection: false,
  browserLanguageDetection: false,
  shallowRender: true,
  strictMode: false
})

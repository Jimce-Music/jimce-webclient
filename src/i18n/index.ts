import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import de from './locales/de/translation.json'
import { detectLanguage } from './detector.ts'
import { APP_LANGUAGES, setSavedLanguage, toAppLanguage } from '../utils/language'

(async () => {
    const detectedLang = detectLanguage(APP_LANGUAGES)

    await i18n.use(initReactI18next).init({
        resources: { en: { translation: en }, de: { translation: de } },
        lng: detectedLang, // force language to different values with ' "<lang_code>" '
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    })

    const appLanguage = toAppLanguage(detectedLang)
    if (appLanguage !== null) {
        setSavedLanguage(appLanguage)
    }
})()

export default i18n

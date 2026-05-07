import {
    APP_LANGUAGES,
    DEFAULT_LANGUAGE,
    LANGUAGE_STORAGE_KEY,
    normalizeLanguageCode
} from '../utils/language'

export function detectLanguage(
    supportedLanguages: readonly string[] = APP_LANGUAGES
): string {
    const savedLanguage =
        typeof window !== 'undefined'
            ? normalizeLanguageCode(
                  window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
              )
            : null

    if (savedLanguage !== null && supportedLanguages.includes(savedLanguage)) {
        return savedLanguage
    }

    const browserLanguage =
        typeof navigator !== 'undefined'
            ? normalizeLanguageCode(navigator.language)
            : null

    if (
        browserLanguage !== null &&
        supportedLanguages.includes(browserLanguage)
    ) {
        return browserLanguage
    }

    return DEFAULT_LANGUAGE
}

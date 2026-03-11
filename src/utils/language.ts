export const LANGUAGE_STORAGE_KEY = 'language'
export const APP_LANGUAGES = ['en', 'de'] as const
export type AppLanguage = (typeof APP_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: AppLanguage = 'en'

function isAppLanguage(value: string): value is AppLanguage {
    return APP_LANGUAGES.includes(value as AppLanguage)
}

export function normalizeLanguageCode(
    language: string | null | undefined
): string | null {
    if (!language) {
        return null
    }

    return language.split('-')[0].toLocaleLowerCase()
}

export function toAppLanguage(
    language: string | null | undefined
): AppLanguage | null {
    const normalizedLanguage = normalizeLanguageCode(language)

    if (normalizedLanguage !== null && isAppLanguage(normalizedLanguage)) {
        return normalizedLanguage
    }

    return null
}

export function getSavedLanguage(): AppLanguage {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE
    }

    return (
        toAppLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)) ??
        DEFAULT_LANGUAGE
    )
}

export function setSavedLanguage(language: AppLanguage): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    }
}
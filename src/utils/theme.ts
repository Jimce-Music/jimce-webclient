const THEME_STORAGE_KEY = 'theme'
const DEFAULT_THEME: AppTheme = 'black'

export const APP_THEMES = ['neon', 'gray', 'oled', 'black'] as const
export type AppTheme = (typeof APP_THEMES)[number]

function isAppTheme(value: string | null): value is AppTheme {
    return value !== null && APP_THEMES.includes(value as AppTheme)
}

export function getSavedTheme(): AppTheme {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isAppTheme(savedTheme)) {
        return savedTheme
    }

    return DEFAULT_THEME
}

export function setTheme(theme: AppTheme): void {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
    }

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
}

export function applySavedTheme(): void {
    setTheme(getSavedTheme())
}

export function detectLanguage(
    supportedLanguages: string[] = ['en', 'de']
): string {
    const lang = navigator.language.split('-')[0].toLocaleLowerCase()
    return supportedLanguages.includes(lang) ? lang : 'en'
}

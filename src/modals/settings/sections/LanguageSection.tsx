import '../../../styles/modals/settings/sections/LanguageSection.css'
import { useEffect, useState } from 'react'

import CustomDropdown from '../../../components/CustomDropdown'
import {
    getSavedLanguage,
    setSavedLanguage,
    toAppLanguage
} from '../../../utils/language'
import type { AppLanguage } from '../../../utils/language'
import { useTranslation } from 'react-i18next'

const languageOptions: Array<{ value: AppLanguage; labelKey: string }> = [
    { value: 'en', labelKey: 'SettingsModal.sections.language.options.en' },
    { value: 'de', labelKey: 'SettingsModal.sections.language.options.de' }
]

export default function LanguageSection() {
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(
        toAppLanguage(i18n.resolvedLanguage ?? i18n.language) ??
            getSavedLanguage()
    )

    useEffect(() => {
        const activeLanguage = toAppLanguage(i18n.resolvedLanguage ?? i18n.language)
        if (activeLanguage !== null) {
            setSelectedLanguage(activeLanguage)
        }
    }, [i18n.language, i18n.resolvedLanguage])

    async function toggleLanguage(language: AppLanguage) {
        await i18n.changeLanguage(language)
        setSavedLanguage(language)
        setSelectedLanguage(language)
    }

    const selectedLanguageLabel = t(
        languageOptions.find((language) => language.value === selectedLanguage)
            ?.labelKey ?? 'SettingsModal.sections.language.options.en'
    )

    return (
        <div className='language-section'>
            <CustomDropdown
                align='left'
                trigger={
                    <button type='button' className='language-selection-dropdown'>
                        {t('SettingsModal.sections.language.language')}{' '}
                        {selectedLanguageLabel}
                    </button>
                }
            >
                {languageOptions.map((language) => (
                    <button
                        key={language.value}
                        type='button'
                        className={`language-option ${
                            selectedLanguage === language.value ? 'active' : ''
                        }`}
                        onClick={() => {
                            void toggleLanguage(language.value)
                        }}
                    >
                        {t(language.labelKey)}
                    </button>
                ))}
            </CustomDropdown>
        </div>
    )
}
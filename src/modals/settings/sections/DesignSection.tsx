import '../../../styles/modals/settings/sections/DesignSection.css'
import { useState } from 'react'

import CustomDropdown from '../../../components/CustomDropdown'
import { getSavedTheme, setTheme } from '../../../utils/theme'
import type { AppTheme } from '../../../utils/theme'
import { useTranslation } from 'react-i18next'

const themeOptions: Array<{ value: AppTheme; labelKey: string }> = [
    { value: 'neon', labelKey: 'SettingsModal.sections.design.options.neon' },
    { value: 'gray', labelKey: 'SettingsModal.sections.design.options.gray' },
    { value: 'oled', labelKey: 'SettingsModal.sections.design.options.oled' },
    { value: 'black', labelKey: 'SettingsModal.sections.design.options.black' }
]

export default function DesignSection() {
    const [selectedTheme, setSelectedTheme] = useState<AppTheme>(getSavedTheme())
    const { t } = useTranslation()
    
    function toggleTheme(theme: AppTheme) {
        setTheme(theme)
        setSelectedTheme(theme)
    }

    const selectedThemeLabel =
        t(
            themeOptions.find((theme) => theme.value === selectedTheme)
                ?.labelKey ?? 'SettingsModal.sections.design.options.black'
        )

    return (
        <div className='design-section'>
            <CustomDropdown
                align='left'
                trigger={
                    <button type='button' className='design-selection-dropdown'>
                        {t("SettingsModal.sections.design.design")} {selectedThemeLabel}
                    </button>
                }
            >
                {themeOptions.map((theme) => (
                    <button
                        key={theme.value}
                        type='button'
                        className={`design-theme-option ${
                            selectedTheme === theme.value ? 'active' : ''
                        }`}
                        onClick={() => toggleTheme(theme.value)}
                    >
                        {t(theme.labelKey)}
                    </button>
                ))}
            </CustomDropdown>
        </div>
    )
}
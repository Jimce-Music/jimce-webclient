import { useTranslation } from "react-i18next"
import '../../../styles/modals/settings/sections/CrossfadeSection.css'
import { useState } from "react"

export default function CrossfadeSection() {
    const { t } = useTranslation()
    const [crossfadeDuration, setCrossfadeDuration] = useState(0)

    return(
        <div>
            <div className="crossfade-settings-container">
                <p className="crossfade-input-description">{t("SettingsModal.sections.crossfade.crossfadeSongs")}</p>
                <input 
                    className="crossfade-input" 
                    type="range" 
                    min={0}
                    max={12}
                    value={crossfadeDuration}
                    onChange={(e) => setCrossfadeDuration(Number(e.target.value))}
                />
                <p className="crossfade-duration">{crossfadeDuration}s</p>
            </div>
        </div>
    )
}
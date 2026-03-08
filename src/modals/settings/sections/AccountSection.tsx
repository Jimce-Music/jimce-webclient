import '../../../styles/modals/settings/sections/AccountSection.css'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import * as api from '@jimce-music/jimce-api-ts'

import visibility from '../../../assets/icons/visibility.svg'
import visibilityOff from '../../../assets/icons/visibility_off.svg'

export default function AccountSection() {
    const { t } = useTranslation()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const[error, setError] = useState('')
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    async function submitChangePassword() {
        if (password !== confirmPassword) {
            setError(t("changePassword.errors.notTheSame"))
            return
        }

        const req = await api.putApiAuthChangePassword({
            body: {
                newPassword: password
            }
        })

        console.error(req.error)
        console.log(req.data)
        if (req.response.status !== 200) {
            if(req.response.status === 400) {
                setError(t("changePassword.errors.passwordToShort"))
            } else if(req.response.status === 401) {
                setError(t("changePassword.errors.unauthorized"))
            } else if(req.response.status === 500) {
                setError(t("changePassword.errors.internalServerError"))
            } else {
                setError(t("changePassword.errors.unexpectedError"))
            }
        } else {
            if(req.data?.success) {
                localStorage.removeItem('token')
            }
            console.log('Changed Password!')
            location.reload()
        }
    }

    useEffect(() => {
        const handleEnter = (event: any) => {
            if (event.key === 'Enter') submitChangePassword()
        }
        document.addEventListener('keydown', handleEnter)
    
        return () => document.removeEventListener('keydown', handleEnter)
    }, [submitChangePassword])

    return(
        <div className="change-password-container">
            <h1 className='change-password-title'>{t("changePassword.title")}</h1>

            <div className='input-container'>
                <input
                    className='change-password-input'
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t("changePassword.placeholder.password")}
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <img
                    src={showPassword ? visibilityOff : visibility}
                    className='password-toggle-icon'
                    onClick={() => setShowPassword(!showPassword)}
                />
            </div>

            <div className='input-container'>
                <input
                    className='change-password-input'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t("changePassword.placeholder.confirmPassword")}
                    id='password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <img
                    src={showConfirmPassword ? visibilityOff : visibility}
                    className='password-toggle-icon'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
            </div>

            <button className='change-password-btn' onClick={submitChangePassword}>
                {t("changePassword.changePasswordBtn")}
            </button>

            {error && <p className='change-password-error-message'>{error}</p>}
        </div>
    )
}

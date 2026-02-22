import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '@jimce-music/jimce-api-ts'
import { useTranslation } from 'react-i18next'

import '../../styles/auth/login.css'
import '../../styles/checkbox.css'

import visibility from '../../assets/icons/visibility.svg'
import visibilityOff from '../../assets/icons/visibility_off.svg'
import User from '../../assets/icons/user.svg'

export default function Login() {
    const { t } = useTranslation()
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)

    async function submitLogin() {
        const req = await api.postApiAuthLoginBasic({
            body: {
                username: user,
                password: password
            }
        })

        console.error(req.error)
        console.log(req.data)
        const token = req.data?.token
        if (req.response.status !== 200) {
            console.error('Login Failed!')
            return
        }
        if (token) {
            localStorage.setItem('token', token)
        }
        if (token) {
            api.setConfig({
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
        }
        console.log('Gespeicherter Token:', localStorage.getItem('token'))
        location.reload()
    }

    useEffect(() => {
        const handleEnter = (event: any) => {
            if (event.key === 'Enter') submitLogin()
        }
        document.addEventListener('keydown', handleEnter)

        return () => document.removeEventListener('keydown', handleEnter)
    }, [submitLogin])

    return (
        <div className='login-modal'>
            <h1 className='login-header'>{t("Login.title")}</h1>
            <div className='input-container'>
                <input
                    className='login-input'
                    type='text'
                    placeholder={t("Login.placeholder.user")}
                    id='user'
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
                <img src={User} />
            </div>
            <div className='input-container'>
                <input
                    className='register-input'
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t("Login.placeholder.password")}
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <img
                    src={showPassword ? visibilityOff : visibility}
                    className='password-toggle-icon'
                    onClick={() => setShowPassword(!showPassword)}
                />
            </div>
            <div className='remember'>
                <input type='checkbox' id='remember' className='ui-checkbox' />
                <label htmlFor='remember'>{t("Login.remember")}</label>
            </div>
            <button className='login-btn' onClick={submitLogin}>
                {t("Login.login")}
            </button>
            <Link className='forgot-pwd-btn' to='/auth/forgot-pwd'>
                {t("Login.forgotPassword")}
            </Link>
        </div>
    )
}

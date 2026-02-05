import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '@jimce-music/jimce-api-ts'

import '../../styles/auth/login.css'
import '../../styles/checkbox.css'

import visibility from '../../assets/icons/visibility.svg'
import visibilityOff from '../../assets/icons/visibility_off.svg'
import User from '../../assets/icons/user.svg'

export default function Login() {
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

    return (
        <div className='login-modal'>
            <h1 className='login-header'>Jimce Anmeldung</h1>
            <div className='input-container'>
                <input
                    className='login-input'
                    type='text'
                    placeholder='Benutzername / E-Mail'
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
                    placeholder='Passwort'
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <img
                    src={showPassword ? visibilityOff : visibility}
                    className='password-toggle-icon'
                    onClick={() => setShowPassword(!showPassword)}
                    alt='Anzeigen'
                />
            </div>
            <div className='remember'>
                <input type='checkbox' id='remember' className='ui-checkbox' />
                <label htmlFor='remember'>Angemeldet bleiben</label>
            </div>
            <button className='login-btn' onClick={submitLogin}>
                Anmelden
            </button>
            <Link className='forgot-pwd-btn' to='/auth/forgot-pwd'>
                Passwort vergessen?
            </Link>
        </div>
    )
}

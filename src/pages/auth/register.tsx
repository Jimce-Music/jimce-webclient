import { useState, useEffect } from 'react'
import * as api from '@jimce-music/jimce-api-ts'

import '../../styles/auth/register.css'

import visibility from '../../assets/icons/visibility.svg'
import visibilityOff from '../../assets/icons/visibility_off.svg'
import User from '../../assets/icons/user.svg'
import Mail from '../../assets/icons/mail.svg'

export default function Register() {
    const [username, setUsername] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [finalPassword, setFinalPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        async function fetchRegister() {
            if (finalPassword !== '') {
                console.log(username)
                console.log(mail)
                console.log(password)
                console.log(confirmPassword)
                console.log(finalPassword)

                const isAdmin = await api.getApiMeUserinfo()
                if (!isAdmin) {
                    console.error('Attribute isAdmin not set!')
                }
                console.log(isAdmin.data?.isAdmin)

                const req = await api.putApiAdminUsersCreateOrChange({
                    body: {
                        username: username,
                        password: finalPassword,
                        email: mail,
                        isAdmin: false
                    }
                })

                console.log(req.error)
                console.log(req.data)
            }
        }

        fetchRegister()
    }, [finalPassword])

    function submitRegister() {
        if (password.length < 12) {
            console.error('Password to short!')
            setErrorMessage('Password to short!')
            return
        }
        if (password !== confirmPassword) {
            console.error('Passwords not the same!')
            setErrorMessage('Passwords not the same!')
            return
        }
        setFinalPassword(password)
        setErrorMessage('')
        // trigger useEffect async function fetchRegister()
    }

    return (
        <div className='register-modal'>
            <h1 className='register-header'>Jimce Registrierung</h1>
            <div className='input-container'>
                <input
                    className='register-input'
                    type='text'
                    placeholder='Benutzername'
                    id='username'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <img src={User} />
            </div>
            <div className='input-container'>
                <input
                    className='register-input'
                    type='email'
                    placeholder='E-Mail'
                    id='email'
                    onChange={(e) => setMail(e.target.value)}
                />
                <img src={Mail} />
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

            <div className='input-container'>
                <input
                    className='register-input'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Passwort wiederholen'
                    id='repeat-password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <img
                    src={showConfirmPassword ? visibilityOff : visibility}
                    className='password-toggle-icon'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    alt='Anzeigen'
                />
            </div>

            <button className='register-btn' onClick={submitRegister}>
                Registrieren
            </button>

            {errorMessage !== '' ? (
                <span className='register-error-message'>{errorMessage}</span>
            ) : (
                <></>
            )}
        </div>
    )
}

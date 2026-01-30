import { useState } from 'react'

import '../../styles/auth/register.css'

import visibility from '../../assets/icons/visibility.svg'
import visibilityOff from '../../assets/icons/visibility_off.svg'
import User from '../../assets/icons/user.svg'
import Mail from '../../assets/icons/mail.svg'
import { data } from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [finalPassword, setFinalPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    function submitRegister() {
        comparePasswords()
        console.log(username)
        console.log(mail)
        console.log(password)
        console.log(confirmPassword)
        console.log(finalPassword)
    }

    function comparePasswords() {
        if(password === confirmPassword) {
            setFinalPassword(password)
        } else {
            console.error("Passwords not the same!")
            return
        }
    }

    return(
        <div className="register-modal">
            <h1 className='register-header'>Jimce Registrierung</h1>
            <div className='input-container'>
                <input 
                    className="register-input" 
                    type="text" 
                    placeholder='Benutzername' 
                    id="username" 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <img 
                    src={User} 
                />
            </div>
            <div className='input-container'>
                <input 
                    className='register-input' 
                    type="email" 
                    placeholder="E-Mail" 
                    id="email" 
                    onChange={(e) => setMail(e.target.value)}
                />
                <img 
                    src={Mail} 
                />
            </div>
            
            <div className="input-container">
                <input 
                    className='register-input' 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Passwort" 
                    id="password" 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <img 
                    src={showPassword ? visibilityOff : visibility} 
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    alt="Anzeigen"
                />
            </div>

            <div className="input-container">
                <input 
                    className='register-input' 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Passwort wiederholen" 
                    id="repeat-password" 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <img 
                    src={showConfirmPassword ? visibilityOff : visibility} 
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    alt="Anzeigen"
                />
            </div>

            <button className='register-btn' onClick={submitRegister}>
                Registrieren
            </button>
        </div>
    )
}
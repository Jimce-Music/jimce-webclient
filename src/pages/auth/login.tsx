import { useState } from 'react';
import { Link } from 'react-router-dom'

import '../../styles/auth/login.css'
import '../../styles/checkbox.css'

import visibility from '../../assets/icons/visibility.svg'
import visibilityOff from '../../assets/icons/visibility_off.svg'
import User from '../../assets/icons/user.svg'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    function submitLogin() {
        console.log("login completed")
    }

    return(
        <div className="login-modal">
            <h1 className='login-header'>Jimce Anmeldung</h1>
            <div className="input-container">
                <input 
                    className='login-input' 
                    type="text" 
                    placeholder="Benutzername / E-Mail" 
                    id="user" 
                    required 
                />
                <img 
                    src={User}
                 />
            </div>
            <div className="input-container">
                <input 
                    className='register-input' 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Passwort" 
                    id="password" 
                />
                <img 
                    src={showPassword ? visibilityOff : visibility} 
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    alt="Anzeigen"
                />
            </div>
            <div className="remember">
                <input type="checkbox" id='remember' className="ui-checkbox" />
                <label htmlFor='remember'>Angemeldet bleiben</label>
            </div>
            <button 
                className='login-btn'
                onClick={submitLogin}
            >
                Anmelden
            </button>
            <Link
                className='forgot-pwd-btn'
                to='/auth/forgot-pwd'
            >
                Passwort vergessen?
            </Link>
        </div>
    )
}
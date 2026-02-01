import '../utils/logout'
import logout from '../utils/logout';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as api from '@jimce-music/jimce-api-ts'

import '../styles/components/TopBar.css';

import UserIcon from '../assets/icons/user.svg';
import SearchIcon from '../assets/icons/search.svg';

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const dropdownRef = useRef(null); // Referenz für den Container

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {
        logout()
        window.location.hash = '/'
    }

    async function checkAuth() {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.hash = '/auth/login'; 
            return;
        }

        try {
            const req = await api.getApiAuthCheckToken();

            if (req.response.status === 200) {
                console.log('Logged in!');
                setIsAuthenticated(true);
            } else {
                console.warn('Token invalid!');
                localStorage.removeItem('token');
                window.location.hash = '/login.html';
            }
        } catch (error) {
            console.error('Netzwerkfehler beim Auth-Check');
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

return (
        <div className="topbar">
            <div className="search-bar">
                <img src={SearchIcon} alt="Search" className="search-icon" />
                <input 
                    type="text" 
                    name="Search" 
                    placeholder='Search for Music, Podcasts and Audiobooks' 
                />
            </div>

            {/* Hier die Ref an den Container hängen */}
            <div className="profile-container" ref={dropdownRef}>
                <img 
                    className="profile" 
                    src={UserIcon} 
                    alt="Profile" 
                    onClick={toggleDropdown} 
                />

                <div className={`account-dropdown ${isOpen ? 'show' : ''}`}>
                    <Link to="/change-password" onClick={toggleDropdown}>Passwort ändern</Link>
                    <button onClick={handleLogout} className="logout-btn">
                        Abmelden
                    </button>
                </div>
            </div>
        </div>
    )
}
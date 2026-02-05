import '../utils/logout'
import logout from '../utils/logout'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import '../styles/components/TopBar.css'

import UserIcon from '../assets/icons/user.svg'
import SearchIcon from '../assets/icons/search.svg'

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const toggleModal = () => {
        setIsActive(!isActive)
        setIsOpen(false)
    }

    const handleLogout = () => {
        setIsActive(false)
        logout()
        window.location.hash = '/'
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className='topbar'>
            <div className='search-bar'>
                <img src={SearchIcon} alt='Search' className='search-icon' />
                <input
                    type='text'
                    name='Search'
                    placeholder='Search for Music, Podcasts and Audiobooks'
                />
            </div>

            {/* Hier die Ref an den Container hängen */}
            <div className='profile-container' ref={dropdownRef}>
                <img
                    className='profile'
                    src={UserIcon}
                    alt='Profile'
                    onClick={toggleDropdown}
                />

                <div className={`account-dropdown ${isOpen ? 'show' : ''}`}>
                    <Link to='/change-password' onClick={toggleDropdown}>
                        Passwort ändern
                    </Link>
                    <button onClick={toggleModal} className='logout-btn'>
                        Abmelden
                    </button>
                </div>
            </div>

            <div
                className={`logout-modal-backdrop ${isActive ? 'active' : ''}`}
                onClick={() => toggleModal}
            >
                <div className={`logout-modal ${isActive ? 'active' : ''}`}>
                    <h1 className='logout-modal-title'>
                        Möchtest du dich wirklich ausloggen?
                    </h1>
                    <div className='logout-modal-title-underline'></div>
                    <div className='logout-modal-options'>
                        <button
                            className='logout-modal-confirm'
                            onClick={() => setIsActive(false)}
                        >
                            Abbrechen
                        </button>
                        <button
                            className='logout-modal-cancel'
                            onClick={handleLogout}
                        >
                            Bestätigen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

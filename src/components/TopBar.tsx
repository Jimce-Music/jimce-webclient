import '../utils/logout'
import logout from '../utils/logout'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import CustomDropdown from './CustomDropdown'
import '../styles/components/TopBar.css'

import UserIcon from '../assets/icons/user.svg'
import SearchIcon from '../assets/icons/search.svg'

export default function TopBar() {
    const { t } = useTranslation()
    const [isActive, setIsActive] = useState(false)
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const overlaySearchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isSearchActive && overlaySearchInputRef.current) {
            // Nutze setTimeout, um sicherzustellen, dass das DOM aktualisiert wurde
            setTimeout(() => {
                overlaySearchInputRef.current?.focus()
            }, 0)
        }
    }, [isSearchActive])

    const toggleModal = () => {
        setIsActive(!isActive)
    }

    const handleLogout = () => {
        setIsActive(false)
        logout()
        window.location.hash = '/'
    }

    const closeSearch = () => {
        setIsSearchActive(false)
    }

    const searchBar = (
        <div
            className={`search-bar ${isSearchActive ? 'active' : ''}`}
            onClick={(event) => event.stopPropagation()}
        >
            <img src={SearchIcon} alt='Search' className='search-icon' />
            <input
                type='text'
                name='Search'
                value={searchValue}
                placeholder={t('TopBar.SearchBar')}
                onChange={(event) => setSearchValue(event.target.value)}
                onFocus={() => setIsSearchActive(true)}
                onBlur={closeSearch}
            />
        </div>
    )

    return (
        <div className='topbar'>
            {!isSearchActive && searchBar}
            {isSearchActive && <div className='search-bar-spacer' />}

            <CustomDropdown
                trigger={<img className='profile' src={UserIcon} alt='Profile' />}
                align='right'
            >
                <button onClick={toggleModal} className='logout-btn'>
                    {t('TopBar.Profile.logout')}
                </button>
            </CustomDropdown>

            <div
                className={`logout-modal-backdrop ${isActive ? 'active' : ''}`}
                onClick={() => toggleModal}
            >
                <div className={`logout-modal ${isActive ? 'active' : ''}`}>
                    <h1 className='logout-modal-title'>
                        {t('TopBar.logoutModal.title')}
                    </h1>
                    <div className='logout-modal-title-underline'></div>
                    <div className='logout-modal-options'>
                        <button
                            className='logout-modal-confirm'
                            onClick={() => setIsActive(false)}
                        >
                            {t('TopBar.logoutModal.cancel')}
                        </button>
                        <button
                            className='logout-modal-cancel'
                            onClick={handleLogout}
                        >
                            {t('TopBar.logoutModal.confirm')}
                        </button>
                    </div>
                </div>
            </div>

            {isSearchActive &&
                createPortal(
                    <div className='search-overlay' onClick={closeSearch}>
                        <div className='search-overlay-backdrop' />
                        <div
                            className={`search-bar ${isSearchActive ? 'active' : ''}`}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <img src={SearchIcon} alt='Search' className='search-icon' />
                            <input
                                ref={overlaySearchInputRef}
                                type='text'
                                name='Search'
                                value={searchValue}
                                placeholder={t('TopBar.SearchBar')}
                                onChange={(event) => setSearchValue(event.target.value)}
                                onFocus={() => setIsSearchActive(true)}
                                onBlur={closeSearch}
                            />
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    )
}

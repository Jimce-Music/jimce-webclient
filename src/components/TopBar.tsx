import '../utils/logout'
import logout from '../utils/logout'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDropdown from './CustomDropdown'
import '../styles/components/TopBar.css'

import UserIcon from '../assets/icons/user.svg'
import SearchIcon from '../assets/icons/search.svg'

export default function TopBar() {
    const { t } = useTranslation()
    const [isActive, setIsActive] = useState(false)

    const toggleModal = () => {
        setIsActive(!isActive)
    }

    const handleLogout = () => {
        setIsActive(false)
        logout()
        window.location.hash = '/'
    }

    return (
        <div className='topbar'>
            <div className='search-bar'>
                <img src={SearchIcon} alt='Search' className='search-icon' />
                <input
                    type='text'
                    name='Search'
                    placeholder={t('TopBar.SearchBar')}
                />
            </div>

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
        </div>
    )
}

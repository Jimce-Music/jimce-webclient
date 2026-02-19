import { Link, useLocation } from 'react-router-dom'

import '../styles/components/Sidebar.css'
import Logo from '../assets/icons/sidebar/logo-no-bg.svg'
import HomeIcon from '../assets/icons/sidebar/home.svg'
import MusicIcon from '../assets/icons/sidebar/music.svg'
import PodcastIcon from '../assets/icons/sidebar/podcasts.svg'
import AudiobookIcon from '../assets/icons/sidebar/audiobook.svg'
import FavoriteIcon from '../assets/icons/sidebar/favorite.svg'
import RecentIcon from '../assets/icons/sidebar/recent.svg'
import LibraryIcon from '../assets/icons/sidebar/library_music.svg'
import SettingsIcon from '../assets/icons/sidebar/settings.svg'

import '../main.tsx'

import { useTranslation } from 'react-i18next'

interface Props {
    onOpen: () => void
}

export default function Sidebar({ onOpen }: Props) {
    const { t } = useTranslation()
    const location = useLocation()

    const menuItems = [
        { name: t('Sidebar.Dashboard'), path: '/', icon: HomeIcon },
        { name: t('Sidebar.Music'), path: '/music', icon: MusicIcon },
        { name: t('Sidebar.Podcasts'), path: '/podcasts', icon: PodcastIcon },
        {
            name: t('Sidebar.Audiobooks'),
            path: '/audiobooks',
            icon: AudiobookIcon
        }
    ]

    const libraryItems = [
        {
            name: t('Sidebar.Favorites'),
            path: '/favorites',
            icon: FavoriteIcon
        },
        { name: t('Sidebar.Recent'), path: '/recent', icon: RecentIcon },
        { name: t('Sidebar.Library'), path: '/library', icon: LibraryIcon }
    ]

    const SettingsItems = [{ name: t('Sidebar.Settings'), icon: SettingsIcon }]

    return (
        <div className='sidebar'>
            <div>
                <a className='header' href='/'>
                    <img
                        style={{ width: '35px', height: '35px' }}
                        src={Logo}
                        alt='Logo'
                    />
                    <h2>Jimce</h2>
                </a>

                <div className='menu'>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`menu-option ${isActive ? 'active' : ''}`}
                            >
                                <img
                                    className='menu-icon'
                                    src={item.icon}
                                    alt={item.name}
                                />
                                <p>{item.name}</p>
                            </Link>
                        )
                    })}
                </div>

                <div className='library'>
                    {libraryItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`menu-option ${isActive ? 'active' : ''}`}
                            >
                                <img
                                    className='menu-icon'
                                    src={item.icon}
                                    alt={item.name}
                                />
                                <p>{item.name}</p>
                            </Link>
                        )
                    })}
                </div>

                <div className='settings'>
                    {SettingsItems.map((item) => {
                        return (
                            <a
                                key={item.name}
                                onClick={() => onOpen()}
                                className={'menu-option'}
                            >
                                <img
                                    className='menu-icon'
                                    src={item.icon}
                                    alt={item.name}
                                />
                                <p>{item.name}</p>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

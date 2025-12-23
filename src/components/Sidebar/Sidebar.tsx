import { Link, useLocation } from 'react-router-dom';

import '../../styles/Sidebar.css';
import Logo from '../../assets/react.svg';
import HomeIcon from '../../assets/icons/home.svg';
import MusicIcon from '../../assets/icons/music.svg';
import PodcastIcon from '../../assets/icons/podcasts.svg';
import AudiobookIcon from '../../assets/icons/audiobook.svg';
import FavoriteIcon from '../../assets/icons/favorite.svg';
import RecentIcon from '../../assets/icons/recent.svg';
import LibraryIcon from '../../assets/icons/library_music.svg';
import UserIcon from '../../assets/icons/user.svg';
import SettingsIcon from '../../assets/icons/settings.svg';

import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { name: t("Sidebar.Dashboard"), path: "/", icon: HomeIcon },
        { name: t("Sidebar.Music"), path: "/music", icon: MusicIcon },
        { name: t("Sidebar.Podcasts"), path: "/podcasts", icon: PodcastIcon },
        { name: t("Sidebar.Audiobooks"), path: "/audiobooks", icon: AudiobookIcon }
    ];

    const libraryItems = [
        { name: t("Sidebar.Favorites"), path: "/favorites", icon: FavoriteIcon },
        { name: t("Sidebar.Recent"), path: "/recent", icon: RecentIcon },
        { name: t("Sidebar.Library"), path: "/library", icon: LibraryIcon }
    ]

    return (
        <div className="sidebar">
            <div>
                <a className="header" href="/">
                    <img src={Logo} alt="Logo" />
                    <h2>Jimce</h2>
                </a>

                <div className="menu">
                    <p className='menu-title'>Menu</p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`menu-option ${isActive ? 'active' : ''}`}
                            >
                                <img className="menu-icon" src={item.icon} alt={item.name} />
                                <p>{item.name}</p>
                            </Link>
                        );
                    })}
                </div>

                <div className="library">
                    <p className='library-title'>Library</p>
                    {libraryItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`menu-option ${isActive ? 'active' : ''}`}
                                >
                                    <img className="menu-icon" src={item.icon} alt={item.name} />
                                    <p>{item.name}</p>
                                </Link>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="account-info_settings">
                    <div className="account-info">
                        <img className='user-icon' src={UserIcon} alt=""/>
                        <p className='username'>Marcus Nebel</p>
                    </div>

                    <img src={SettingsIcon} alt="" />
                </div>
            </div>
        </div>
    );
}
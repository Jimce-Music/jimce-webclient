import '../styles/components/TopBar.css';

import UserIcon from '../assets/icons/user.svg';
import SearchIcon from '../assets/icons/search.svg';

export default function TopBar() {
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

            <div>
                <img className="profile" src={UserIcon} alt="Profile" />
            </div>
        </div>
    )
}
import '../utils/logout'
import logout from '../utils/logout'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { GetApiDummySchemasSearchSchemaResponses } from '@jimce-music/jimce-api-ts'
import { searchStreamed } from  '../utils/searchStreamed'
import { loadCoverFromDb } from '../utils/loadCoverFromDB'

import CustomDropdown from './CustomDropdown'
import '../styles/components/TopBar.css'

import UserIcon from '../assets/icons/user.svg'
import SearchIcon from '../assets/icons/search.svg'
import FallbackCover from '../assets/images/fallbackTrackCover.svg'
// import { PlayerProvider } from '../PlayerContext'

type SongResult = GetApiDummySchemasSearchSchemaResponses[200]

export default function TopBar() {
    const { t } = useTranslation()
    const [isActive, setIsActive] = useState(false)
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Partial<SongResult>[]>([])
    const overlaySearchInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<Record<string, string>>({})

    useEffect(() => {
        const loadNewImages = async () => {
            const imageMap = { ...images }
            const newImagesToLoad: Promise<void>[] = []
            let hasChanges = false

            searchResults.forEach((result) => {
                const songId = result.songId || ""

                // Nur laden, wenn das Bild noch nicht geladen wurde
                console.log(result.image)
                if (!imageMap[songId]) {
                    if (result.image?.includes("/api/asset/")) {
                        hasChanges = true
                        newImagesToLoad.push(
                            (async () => {
                                try {
                                    const url = await loadCoverFromDb(result.image || '')
                                    imageMap[songId] = url
                                } catch (err) {
                                    console.error(`Failed to load image for ${result.name}:`, err)
                                }
                            })()
                        )
                    } else if (result.image?.includes("https://cdn-images")) {
                        console.log("CDN Image recognized...")
                        imageMap[songId] = result.image
                        hasChanges = true
                    }
                }
            })

            if (newImagesToLoad.length > 0) {
                await Promise.all(newImagesToLoad)
            }

            if (hasChanges) {
                setImages(imageMap)
            }
        }

        loadNewImages()
    }, [searchResults])

    useEffect(() => {
        if (isSearchActive && overlaySearchInputRef.current) {
            // Nutze setTimeout, um sicherzustellen, dass das DOM aktualisiert wurde
            setTimeout(() => {
                overlaySearchInputRef.current?.focus()
            }, 0)
        }
    }, [isSearchActive])

    useEffect(() => {
        // Debounce: Sende Search-Request nach 5 Sekunden Inaktivität
        if (query.length === 0) {
            setSearchResults([])
            console.log("Clear Search Results...")
            return
        }

        const timer = setTimeout(() => {
            console.log("Send Search Request...")
            searchStreamed(query, searchResults, setSearchResults)
        }, 1000)

        console.log("Clear Timer...")
        return () => clearTimeout(timer)
    }, [query])

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
                value={query}
                placeholder={t('TopBar.SearchBar')}
                onChange={(event) => setQuery(event.target.value)}
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
                                value={query}
                                placeholder={t('TopBar.SearchBar')}
                                onChange={(event) => setQuery(event.target.value)}
                                onFocus={() => setIsSearchActive(true)}
                                onBlur={closeSearch}
                            />

                            <div className="results">
                                {searchResults.map((results, index) => {
                                    return(
                                        <a 
                                            className='search-result'
                                            key={results.songId || `result-${index}`}
                                        >
                                            <img 
                                src={images[results.songId|| ''] || FallbackCover} 
                                            />

                                            <div className="song-info">
                                                <p className='song-name'>{results.name}</p>
                                                <p className='artist-name'>{results.artistName}</p>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    )
}

import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import '../styles/components/CustomDropdown.css'

interface CustomDropdownProps {
    trigger: ReactNode
    children: ReactNode
    align?: 'left' | 'right'
    className?: string
}

export default function CustomDropdown({
    trigger,
    children,
    align = 'left',
    className = ''
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                closeDropdown()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
            <div className='custom-dropdown-trigger' onClick={toggleDropdown}>
                {trigger}
            </div>

            <div
                className={`custom-dropdown-menu custom-dropdown-align-${align} ${
                    isOpen ? 'custom-dropdown-show' : ''
                }`}
            >
                <div onClick={closeDropdown}>{children}</div>
            </div>
        </div>
    )
}

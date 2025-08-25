import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true)

    // Load theme preference from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark')
        } else {
            // Default to dark mode
            setIsDarkMode(true)
        }
    }, [])

    // Save theme preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
        // Update document class for global CSS variables
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
    }

    const value = {
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? 'dark' : 'light'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

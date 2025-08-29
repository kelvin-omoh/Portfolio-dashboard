import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MobileNotification = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth <= 768 || 
                         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobileCheck)
      setIsVisible(mobileCheck)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Remember user dismissed for this session
    sessionStorage.setItem('mobile-notification-dismissed', 'true')
  }

  useEffect(() => {
    const dismissed = sessionStorage.getItem('mobile-notification-dismissed')
    if (dismissed) {
      setIsVisible(false)
    }
  }, [])

  if (!isMobile || !isVisible) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-red-900/95' : 'bg-red-100/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-red-700' : 'border-red-300'}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center space-x-3">
          {/* Warning Icon */}
          <div className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Simple Warning Message */}
          <div className={`font-bold font-satoshi ${isDarkMode ? 'text-red-300' : 'text-red-800'} text-sm`}>
            ⚠️ VIEW ONLY ON PC - This platform requires desktop/laptop computer
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className={`w-5 h-5 rounded-full ${isDarkMode ? 'text-red-400 hover:bg-red-800/50' : 'text-red-600 hover:bg-red-200/50'} transition-colors duration-200 flex items-center justify-center`}
            title="Dismiss warning"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileNotification

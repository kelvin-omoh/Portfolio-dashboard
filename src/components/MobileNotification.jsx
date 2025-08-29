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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-lg">
      <div className="text-center px-8 py-12 max-w-md mx-auto">
        {/* RicardianCorp Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center mb-4">
            <span className="font-bold text-4xl font-ivy">R</span>
          </div>
          <h1 className="text-2xl font-bold font-satoshi text-white mb-2">
            RicardianCorp
          </h1>
          <p className="text-sm font-satoshi text-gray-300">
            Professional Trading Platform
          </p>
        </div>

        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-6 text-red-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Warning Message */}
        <div className="mb-8">
          <h2 className="text-xl font-bold font-satoshi text-red-400 mb-4">
            ⚠️ PC REQUIRED
          </h2>
          <p className="text-white font-satoshi text-lg leading-relaxed mb-4">
            Please view this platform on your <strong className="text-red-400">PC or laptop computer</strong>
          </p>
          <p className="text-gray-300 font-satoshi text-sm">
            This professional trading platform requires a desktop environment for optimal performance
          </p>
        </div>

        {/* Action Instructions */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <span>💻</span>
            <span className="font-satoshi text-sm">Open on Desktop/Laptop</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <span>🔗</span>
            <span className="font-satoshi text-sm">Same URL on PC Browser</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-satoshi font-medium rounded-lg transition-colors duration-200"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  )
}

export default MobileNotification

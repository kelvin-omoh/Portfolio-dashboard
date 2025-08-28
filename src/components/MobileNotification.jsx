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
    <div className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-amber-900/95' : 'bg-amber-100/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-amber-700' : 'border-amber-300'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start space-x-3">
          {/* Warning Icon */}
          <div className={`flex-shrink-0 w-6 h-6 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className={`text-sm font-bold font-ivy ${isDarkMode ? 'text-amber-300' : 'text-amber-800'} mb-1`}>
              📱 Mobile Device Detected
            </h3>
            <p className={`text-xs font-satoshi ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} leading-relaxed`}>
              <strong>Ricardian Trading Platform</strong> is optimized for desktop/laptop computers with larger screens. 
              For the best trading experience with full functionality, charts, and real-time data visualization, 
              please access this platform on your <strong>PC or laptop</strong>.
            </p>
            <div className="mt-2 flex items-center space-x-4">
              <div className={`text-xs font-satoshi ${isDarkMode ? 'text-amber-300' : 'text-amber-600'} flex items-center space-x-1`}>
                <span>💻</span>
                <span>Best on Desktop</span>
              </div>
              <div className={`text-xs font-satoshi ${isDarkMode ? 'text-amber-300' : 'text-amber-600'} flex items-center space-x-1`}>
                <span>⚡</span>
                <span>HFT Optimized</span>
              </div>
              <div className={`text-xs font-satoshi ${isDarkMode ? 'text-amber-300' : 'text-amber-600'} flex items-center space-x-1`}>
                <span>📊</span>
                <span>Professional Trading</span>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 w-6 h-6 rounded-full ${isDarkMode ? 'text-amber-400 hover:bg-amber-800/50' : 'text-amber-600 hover:bg-amber-200/50'} transition-colors duration-200 flex items-center justify-center`}
            title="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Additional Info Bar */}
        <div className={`mt-3 pt-2 border-t ${isDarkMode ? 'border-amber-700/50' : 'border-amber-300/50'}`}>
          <div className="flex items-center justify-between text-xs">
            <div className={`font-satoshi ${isDarkMode ? 'text-amber-300' : 'text-amber-700'} flex items-center space-x-1`}>
              <span>🏢</span>
              <span>Ricardian Corp Professional Trading Platform</span>
            </div>
            <div className={`font-satoshi ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} flex items-center space-x-1`}>
              <span>📞</span>
              <span>enterprise@ricardian.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNotification

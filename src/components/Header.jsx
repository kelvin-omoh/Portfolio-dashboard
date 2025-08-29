import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const Header = () => {
  const { portfolio } = useDashboard()
  const { isDarkMode, toggleTheme } = useTheme()
  const [tradingStats, setTradingStats] = useState({
    totalShares: 21000000,
    dailyVolume: 8750000,
    systemLatency: 0
  })

  // Real-time trading stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTradingStats(prev => ({
        totalShares: prev.totalShares + Math.floor(Math.random() * 75000) + 15000, // Faster growth
        dailyVolume: prev.dailyVolume + Math.floor(Math.random() * 40000) + 8000, // More aggressive volume
        systemLatency: Math.random() * 15 + 2 // 2-17ms realistic latency
      }))
    }, 1500) // Moderate updates - every 1.5 seconds

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K'
    return num.toString()
  }

  const formatLatency = (latency) => {
    return `${latency.toFixed(1)}ms`
  }

  return (
    <header className={`${isDarkMode ? 'glass' : 'card-light'} border-b border-opacity-20 theme-transition sticky top-0 z-50`}>
      {/* Desktop Trading Statistics Bar */}
      <div className={`hidden md:block ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} border-b border-opacity-10`}>
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs font-satoshi ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                Total Volume:
              </span>
              <span className={`text-xs font-bold font-satoshi ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {formatNumber(tradingStats.totalShares)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className={`text-xs font-satoshi ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                Daily Volume:
              </span>
              <span className={`text-xs font-bold font-satoshi ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatNumber(tradingStats.dailyVolume)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className={`text-xs font-satoshi ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                System Latency:
              </span>
              <span className={`text-xs font-bold font-satoshi ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {formatLatency(tradingStats.systemLatency)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-satoshi ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode
              ? 'bg-white text-black shadow-lg'
              : 'bg-black text-white shadow-lg'
              }`}>
              <span className="font-bold text-2xl font-ivy">R</span>
            </div>
            <div>
              <h1 className={`text-3xl font-bold font-ivy ${isDarkMode ? 'text-white' : 'text-black'}`}>
                RicardianCorp
              </h1>
              <p className="text-sm font-satoshi opacity-70 mt-1">Professional HFT Platform • NSE & Crypto Markets • Ultra-Low Latency</p>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-sm opacity-70 font-satoshi mb-1">Portfolio Value</p>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>{formatCurrency(portfolio.totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-70 font-satoshi mb-1">Daily Change</p>
              <p className={`text-xl font-semibold font-satoshi ${portfolio.dailyChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {portfolio.dailyChange >= 0 ? '+' : ''}{formatCurrency(portfolio.dailyChange)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-70 font-satoshi mb-1">Change %</p>
              <p className={`text-xl font-semibold font-satoshi ${portfolio.dailyChangePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Theme Toggle and Time */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white shadow-lg'
                : 'bg-black/10 hover:bg-black/20 text-black shadow-md hover:shadow-lg'
                }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Time and Status */}
            <div className="text-center">
              <p className="text-sm opacity-70 font-satoshi mb-1">Last Updated</p>
              <p className={`text-sm font-medium font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - Clean & Focused */}
      <div className="md:hidden">
        {/* Mobile Top Bar with Key Stats */}
        <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} border-b border-opacity-10`}>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs font-satoshi ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>LIVE</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs opacity-60 font-satoshi">Volume</div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {formatNumber(tradingStats.totalShares)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-60 font-satoshi">Latency</div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {formatLatency(tradingStats.systemLatency)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Main Header */}
        <div className="px-4 py-4">
          {/* Top Row: Logo, Company, Theme Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode
                ? 'bg-white text-black shadow-lg'
                : 'bg-black text-white shadow-lg'
                }`}>
                <span className="font-bold text-xl font-ivy">R</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold font-ivy ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  RicardianCorp
                </h1>
                <p className="text-xs font-satoshi opacity-60">HFT Trading</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-black/10 hover:bg-black/20 text-black'
                }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Bottom Row: Portfolio Data */}
          <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs opacity-70 font-satoshi mb-1">Portfolio Value</div>
                <div className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {formatCurrency(portfolio.totalValue)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs opacity-70 font-satoshi mb-1">Daily Change</div>
                <div className={`text-lg font-bold font-satoshi ${portfolio.dailyChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'

const Header = () => {
  const { portfolio } = useDashboard()
  const { isDarkMode, toggleTheme } = useTheme()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <header className={`${isDarkMode ? 'glass' : 'card-light'} border-b border-opacity-20 theme-transition sticky top-0 z-50`}>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode
              ? 'bg-white text-black shadow-lg'
              : 'bg-black text-white shadow-lg'
              }`}>
              <span className="font-bold text-2xl font-ivy">Q</span>
            </div>
            <div>
              <h1 className={`text-3xl font-bold font-ivy ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Quant Analytics
              </h1>
              <p className="text-sm font-satoshi opacity-70 mt-1">Real-time Portfolio Dashboard</p>
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
                {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent}%
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
    </header>
  )
}

export default Header

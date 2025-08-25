import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const ExchangeOverview = ({ exchanges, marketData }) => {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('NSE')
  const [exchangeStatus, setExchangeStatus] = useState({
    NSE: { status: 'active', lastUpdate: new Date(), latency: 45, volume: 0 },
    Quidax: { status: 'active', lastUpdate: new Date(), latency: 32, volume: 0 }
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toString()
  }

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeStatus(prev => ({
        NSE: {
          ...prev.NSE,
          lastUpdate: new Date(),
          latency: Math.floor(Math.random() * 50) + 20,
          status: Math.random() > 0.95 ? 'warning' : 'active',
          volume: prev.NSE.volume + (Math.random() - 0.5) * 10000000
        },
        Quidax: {
          ...prev.Quidax,
          lastUpdate: new Date(),
          latency: Math.floor(Math.random() * 50) + 20,
          status: Math.random() > 0.97 ? 'warning' : 'active',
          volume: prev.Quidax.volume + (Math.random() - 0.5) * 5000000
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Safe data access with fallbacks
  const getNseData = () => ({
    marketCap: marketData?.nse?.marketCap || 0,
    volume: marketData?.nse?.volume || 0,
    activeStocks: marketData?.nse?.gainers + marketData?.nse?.losers || 0,
    index: marketData?.nse?.allShareIndex || 0
  })

  const getQuidaxData = () => ({
    marketCap: marketData?.quidax?.marketCap || 0,
    volume: marketData?.quidax?.volume || 0,
    activePairs: 15, // Default value since not in context
    btcPrice: marketData?.quidax?.btcPrice || 0
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
      case 'warning': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
      case 'error': return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
      default: return null
    }
  }

  return (
    <div className={`${isDarkMode ? 'glass' : 'card-light'} rounded-2xl p-8 animated-border theme-transition`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-ivy mb-2">Exchange Overview</h2>
        <p className="text-sm font-satoshi opacity-70">Real-time market data across exchanges</p>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-3 mb-8">
        {['NSE', 'Quidax'].map((exchange) => {
          const status = exchangeStatus[exchange]
          const isActive = activeTab === exchange
          const data = exchange === 'NSE' ? getNseData() : getQuidaxData()

          return (
            <button
              key={exchange}
              onClick={() => setActiveTab(exchange)}
              className={`relative flex-1 px-6 py-4 rounded-xl font-medium font-satoshi transition-all duration-300 ${isActive
                ? isDarkMode
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-black text-white shadow-lg'
                : isDarkMode
                  ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  : 'bg-black/10 text-black/70 hover:bg-black/20 hover:text-black'
                }`}
            >
              {/* Exchange Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">{exchange}</span>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 ${getStatusColor(status.status)}`}>
                    {getStatusIcon(status.status)}
                    <span className="text-xs capitalize">{status.status}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${status.status === 'active' ? 'bg-green-500' :
                    status.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                </div>
              </div>

              {/* Exchange Stats */}
              <div className="text-left">
                <div className="flex items-center justify-between text-xs opacity-80 mb-1">
                  <span>Latency</span>
                  <span className="font-mono">{status.latency}ms</span>
                </div>
                <div className="flex items-center justify-between text-xs opacity-80">
                  <span>Last Update</span>
                  <span className="font-mono">{status.lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Quick Data Preview */}
              {!isActive && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <div className="text-xs opacity-70 mb-1">
                    {exchange === 'NSE' ? 'Market Cap' : 'BTC Price'}
                  </div>
                  <div className="text-sm font-semibold">
                    {exchange === 'NSE'
                      ? `₦${formatNumber(data.marketCap)}`
                      : `₦${formatNumber(data.btcPrice)}`
                    }
                  </div>
                </div>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Exchange Content */}
      <div className="space-y-6">
        {activeTab === 'NSE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Market Cap</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ₦{formatNumber(getNseData().marketCap)}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">Total Value</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Volume</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ₦{formatNumber(getNseData().volume)}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">24h Trading</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Active Stocks</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {getNseData().activeStocks}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">Trading Today</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Index</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {getNseData().index.toLocaleString()}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">NGX All-Share</p>
            </div>
          </div>
        )}

        {activeTab === 'Quidax' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Market Cap</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ₦{formatNumber(getQuidaxData().marketCap)}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">Total Value</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Volume</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ₦{formatNumber(getQuidaxData().volume)}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">24h Trading</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">Active Pairs</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {getQuidaxData().activePairs}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">Trading Today</p>
            </div>

            <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-white/20 border border-white/20' : 'bg-black/20 border border-black/30'}`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-satoshi mb-2">BTC Price</h3>
              <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                ₦{formatNumber(getQuidaxData().btcPrice)}
              </p>
              <p className="text-sm opacity-70 font-satoshi mt-1">Bitcoin</p>
            </div>
          </div>
        )}
      </div>

      {/* Exchange Status Footer */}
      <div className="mt-8 pt-6 border-t border-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-satoshi opacity-70">All Systems Operational</span>
            </div>
            <span className="opacity-40">|</span>
            <span className="text-sm font-satoshi opacity-60">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-satoshi opacity-60">Exchange Status</p>
            <p className="text-green-500 font-medium font-satoshi">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeOverview

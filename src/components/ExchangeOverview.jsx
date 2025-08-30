import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const ExchangeOverview = ({ exchanges }) => {
  const { isDarkMode } = useTheme()
  const { marketData } = useDashboard()
  const [activeTab, setActiveTab] = useState('NGX')
  const [exchangeStatus, setExchangeStatus] = useState({
    NGX: { status: 'active', lastUpdate: new Date(), latency: 12, volume: 0 }, // Realistic NGX latency
    Quidax: { status: 'active', lastUpdate: new Date(), latency: 23, volume: 0 } // Realistic crypto latency
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

  // Simulate real-time data updates with realistic latencies
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeStatus(prev => ({
        NGX: {
          ...prev.NGX,
          lastUpdate: new Date(),
          latency: Math.floor(Math.random() * 20) + 3, // 3-23ms realistic NGX latency
          status: Math.random() > 0.98 ? 'warning' : 'active',
          volume: prev.NGX.volume + Math.floor(Math.random() * 25000000) + 5000000 // Constantly increasing NGX volume
        },
        Quidax: {
          ...prev.Quidax,
          lastUpdate: new Date(),
          latency: Math.floor(Math.random() * 30) + 8, // 8-38ms realistic crypto latency
          status: Math.random() > 0.96 ? 'warning' : 'active',
          volume: prev.Quidax.volume + Math.floor(Math.random() * 15000000) + 3000000 // Constantly increasing crypto volume
        }
      }))
    }, 2000) // Moderate updates - every 2 seconds

    return () => clearInterval(interval)
  }, [])

  // Safe data access with fallbacks
  const getNseData = () => ({
    marketCap: marketData?.nse?.marketCap || 28500000000000,
    volume: marketData?.nse?.volume || 1250000000,
    activeStocks: (marketData?.nse?.gainers || 45) + (marketData?.nse?.losers || 23),
    index: marketData?.nse?.allShareIndex || 51234.56
  })

  const getQuidaxData = () => ({
    marketCap: marketData?.quidax?.marketCap || 1250000000000,
    volume: marketData?.quidax?.volume || 850000000,
    activePairs: 15, // Default value since not in context
    btcPrice: marketData?.quidax?.btcPrice || 45000000
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
    <div className={`${isDarkMode ? 'glass' : 'card-light'} rounded-xl md:rounded-2xl p-4 md:p-8 animated-border theme-transition`}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-ivy mb-1 md:mb-2">Exchange Overview</h2>
            <p className="text-xs md:text-sm font-satoshi opacity-70 hidden sm:block">Live market data • NGX equities & crypto trading • Sub-30ms latency</p>
            <p className="text-xs font-satoshi opacity-70 sm:hidden">Live market data</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-satoshi opacity-60">Click to switch exchanges</span>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 md:space-x-3 mb-6 md:mb-8">
        {['NGX', 'Quidax'].map((exchange) => {
          const status = exchangeStatus[exchange]
          const isActive = activeTab === exchange
          const data = exchange === 'NGX' ? getNseData() : getQuidaxData()

          return (
            <button
              key={exchange}
              onClick={() => setActiveTab(exchange)}
              className={`group relative flex-1 px-3 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl font-medium font-satoshi transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${isActive
                ? isDarkMode
                  ? 'bg-slate-800/80 text-white shadow-xl border-2 border-blue-500/50 backdrop-blur-sm'
                  : 'bg-slate-100/90 text-slate-800 shadow-xl border-2 border-blue-500/60 backdrop-blur-sm'
                : isDarkMode
                  ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:shadow-lg border-2 border-transparent hover:border-white/30'
                  : 'bg-black/10 text-black/70 hover:bg-black/20 hover:text-black hover:shadow-lg border-2 border-transparent hover:border-black/30'
                }`}
              title={`Click to view ${exchange} exchange data`}
            >
              {/* Exchange Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-base md:text-lg font-semibold">{exchange}</span>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs opacity-70 mb-1">
                        {exchange === 'NGX' ? 'Market Cap' : 'BTC Price'}
                      </div>
                      <div className="text-sm font-semibold">
                        {exchange === 'NGX'
                          ? `₦${formatNumber(data.marketCap)}`
                          : `₦${formatNumber(data.btcPrice)}`
                        }
                      </div>
                    </div>
                    <div className="text-xs opacity-50 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Click
                    </div>
                  </div>
                </div>
              )}

              {/* Active Indicators */}
              {isActive && (
                <>
                  {/* Gradient Top Bar - properly positioned */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-t-xl"></div>
                  {/* Status Dot - repositioned to avoid gradient */}
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  {/* Active Label - cleaner positioning */}
                  <div className="absolute bottom-1 left-2 text-xs opacity-75 font-medium text-green-400">
                    ● LIVE
                  </div>
                </>
              )}

              {/* Hover Click Indicator */}
              {!isActive && (
                <div className="absolute bottom-2 right-2 text-xs opacity-0 group-hover:opacity-50 transition-opacity duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Exchange Content - Responsive */}
      <div className="space-y-6">
        {/* Desktop View */}
        <div className="hidden md:block">
          {activeTab === 'NGX' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold font-satoshi mb-2">Index</h3>
                <p className={`text-2xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {getNseData().index.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm opacity-70 font-satoshi mt-1">NGX All-Share</p>
              </div>
            </div>
          )}

          {activeTab === 'Quidax' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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

        {/* Mobile View - Simplified Cards */}
        <div className="md:hidden">
          {activeTab === 'NGX' && (
            <div className="space-y-4">
              {/* Primary Market Data Card */}
              <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-4 border`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-satoshi">NGX Market Data</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">All-Share Index</div>
                    <div className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {getNseData().index.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Market Cap</div>
                    <div className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      ₦{formatNumber(getNseData().marketCap)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Data Card */}
              <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-4 border`}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Volume (24h)</div>
                    <div className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₦{formatNumber(getNseData().volume)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Active Stocks</div>
                    <div className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {getNseData().activeStocks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Quidax' && (
            <div className="space-y-4">
              {/* Primary Crypto Data Card */}
              <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-4 border`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-satoshi">Quidax Crypto</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Bitcoin Price</div>
                    <div className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      ₦{formatNumber(getQuidaxData().btcPrice)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Market Cap</div>
                    <div className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      ₦{formatNumber(getQuidaxData().marketCap)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Data Card */}
              <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/30'} rounded-xl p-4 border`}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Volume (24h)</div>
                    <div className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₦{formatNumber(getQuidaxData().volume)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70 font-satoshi mb-1">Active Pairs</div>
                    <div className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {getQuidaxData().activePairs}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

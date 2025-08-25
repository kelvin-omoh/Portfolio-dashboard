import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const PortfolioSummary = () => {
  const { portfolio, marketData } = useDashboard()
  const { isDarkMode } = useTheme()
  const [livePositions, setLivePositions] = useState([])
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    beta: 0,
    alpha: 0
  })
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D')
  const [isUpdating, setIsUpdating] = useState(false)

  // Generate dynamic portfolio positions with real-time data
  useEffect(() => {
    const generatePositions = () => {
      const symbols = [
        { symbol: 'MTN', name: 'MTN Nigeria', exchange: 'NSE', sector: 'Telecommunications' },
        { symbol: 'DANGOTE', name: 'Dangote Cement', exchange: 'NSE', sector: 'Industrial Goods' },
        { symbol: 'ZENITH', name: 'Zenith Bank', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'GTCO', name: 'GTCO Plc', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'ACCESS', name: 'Access Bank', exchange: 'NSE', sector: 'Financial Services' },
        { symbol: 'BTC', name: 'Bitcoin', exchange: 'Quidax', sector: 'Cryptocurrency' },
        { symbol: 'ETH', name: 'Ethereum', exchange: 'Quidax', sector: 'Cryptocurrency' },
        { symbol: 'BNB', name: 'Binance Coin', exchange: 'Quidax', sector: 'Cryptocurrency' },
        { symbol: 'SOL', name: 'Solana', exchange: 'Quidax', sector: 'Cryptocurrency' },
        { symbol: 'ADA', name: 'Cardano', exchange: 'Quidax', sector: 'Cryptocurrency' }
      ]

      return symbols.map((item, index) => {
        const basePrice = item.exchange === 'NSE' ?
          (Math.random() * 500 + 50) :
          (Math.random() * 50000 + 10000)

        const quantity = Math.floor(Math.random() * 1000) + 100
        const avgPrice = basePrice * (0.9 + Math.random() * 0.2)
        const currentPrice = avgPrice * (0.8 + Math.random() * 0.4)
        const pnl = (currentPrice - avgPrice) * quantity
        const pnlPercent = ((currentPrice - avgPrice) / avgPrice) * 100

        return {
          id: index + 1,
          ...item,
          quantity,
          avgPrice,
          currentPrice,
          pnl,
          pnlPercent,
          value: currentPrice * quantity,
          volume: Math.floor(Math.random() * 1000000) + 100000,
          marketCap: Math.floor(Math.random() * 1000000000) + 100000000,
          pe: (Math.random() * 30 + 10).toFixed(2),
          dividend: item.exchange === 'NSE' ? (Math.random() * 5 + 1).toFixed(2) : 0,
          beta: (Math.random() * 2 + 0.5).toFixed(2),
          volatility: (Math.random() * 0.3 + 0.1).toFixed(3),
          lastUpdate: new Date()
        }
      })
    }

    setLivePositions(generatePositions())
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true)

      setLivePositions(prev => prev.map(position => {
        const volatility = parseFloat(position.volatility)
        const priceChange = (Math.random() - 0.5) * volatility * position.currentPrice
        const newPrice = Math.max(position.currentPrice + priceChange, 0.01)
        const newPnL = (newPrice - position.avgPrice) * position.quantity
        const newPnLPercent = ((newPrice - position.avgPrice) / position.avgPrice) * 100

        return {
          ...position,
          currentPrice: newPrice,
          pnl: newPnL,
          pnlPercent: newPnLPercent,
          value: newPrice * position.quantity,
          volume: Math.max(position.volume + (Math.random() - 0.5) * 100000, 10000),
          lastUpdate: new Date()
        }
      }))

      // Update portfolio metrics
      setTimeout(() => {
        const totalValue = livePositions.reduce((sum, pos) => sum + pos.value, 0)
        const totalPnL = livePositions.reduce((sum, pos) => sum + pos.pnl, 0)
        const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0

        setPortfolioMetrics(prev => ({
          ...prev,
          totalValue,
          totalPnL,
          totalPnLPercent,
          volatility: (Math.random() * 0.2 + 0.1).toFixed(3),
          sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2),
          maxDrawdown: (Math.random() * 0.15 + 0.05).toFixed(3),
          beta: (Math.random() * 1.5 + 0.5).toFixed(2),
          alpha: (Math.random() * 0.1 - 0.05).toFixed(3)
        }))
        setIsUpdating(false)
      }, 500)

    }, 2000)

    return () => clearInterval(interval)
  }, [livePositions])

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

  const formatPercentage = (num) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-green-600 dark:text-green-400'
    if (pnl < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getPnLBackground = (pnl, isDark) => {
    if (pnl > 0) return isDark ? 'bg-green-500/20' : 'bg-green-100'
    if (pnl < 0) return isDark ? 'bg-red-500/20' : 'bg-red-100'
    return isDark ? 'bg-gray-500/20' : 'bg-gray-100'
  }

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

  return (
    <div className={`${isDarkMode ? 'glass' : 'card-light'} rounded-2xl p-6 animated-border theme-transition`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-white/20' : 'bg-black/5'} rounded-xl p-4 mb-6 border ${isDarkMode ? 'border-white/20' : 'border-black/30'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold font-ivy ${isDarkMode ? 'text-white' : 'text-black'} mb-2`}>Portfolio Summary</h2>
            <p className="text-sm font-satoshi opacity-70">Real-time investment overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-satoshi opacity-70">
              {isUpdating ? 'Updating...' : 'Live'}
            </span>
          </div>
        </div>

        {/* Portfolio Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Total Value</p>
            <p className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {formatCurrency(portfolioMetrics.totalValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Total P&L</p>
            <p className={`text-lg font-bold font-satoshi ${getPnLColor(portfolioMetrics.totalPnL)}`}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">P&L %</p>
            <p className={`text-lg font-bold font-satoshi ${getPnLColor(portfolioMetrics.totalPnLPercent)}`}>
              {formatPercentage(portfolioMetrics.totalPnLPercent)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Volatility</p>
            <p className={`text-lg font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {(portfolioMetrics.volatility * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Portfolio Metrics */}
      <div className={`${isDarkMode ? 'bg-white/10' : 'bg-black/5'} rounded-xl p-4 mb-6 border ${isDarkMode ? 'border-white/20' : 'border-black/30'}`}>
        <h3 className="text-lg font-semibold font-ivy mb-4">Quantitative Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Sharpe Ratio</p>
            <p className={`text-sm font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {portfolioMetrics.sharpeRatio}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Max Drawdown</p>
            <p className={`text-sm font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {(portfolioMetrics.maxDrawdown * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Beta</p>
            <p className={`text-sm font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {portfolioMetrics.beta}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Alpha</p>
            <p className={`text-sm font-bold font-satoshi ${getPnLColor(portfolioMetrics.alpha * 100)}`}>
              {(portfolioMetrics.alpha * 100).toFixed(2)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-satoshi opacity-70 mb-1">Risk Level</p>
            <p className={`text-sm font-bold font-satoshi ${portfolioMetrics.volatility < 0.15 ? 'text-green-600' :
              portfolioMetrics.volatility < 0.25 ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {portfolioMetrics.volatility < 0.15 ? 'Low' :
                portfolioMetrics.volatility < 0.25 ? 'Medium' : 'High'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-ivy">Top Positions</h3>
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-xs font-satoshi transition-all duration-200 ${selectedTimeframe === timeframe
                ? isDarkMode
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDarkMode
                  ? 'bg-white/10 text-white/70 hover:bg-white/20'
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
                }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Positions Table */}
      <div className="mb-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className={`${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-t-xl p-4 border-b ${isDarkMode ? 'border-white/20' : 'border-black/30'}`}>
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold font-satoshi">
                <div className="col-span-2">Symbol & Exchange</div>
                <div className="col-span-1 text-center">Quantity</div>
                <div className="col-span-1 text-center">Avg Price</div>
                <div className="col-span-1 text-center">Current</div>
                <div className="col-span-1 text-center">Value</div>
                <div className="col-span-2 text-center">P&L</div>
                <div className="col-span-1 text-center">P/E</div>
                <div className="col-span-1 text-center">Volume</div>
                <div className="col-span-1 text-center">Risk</div>
                <div className="col-span-1 text-center">Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="space-y-2">
              {livePositions.slice(0, 8).map((position) => (
                <div
                  key={position.id}
                  className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 border ${isDarkMode ? 'border-white/10' : 'border-black/30'} transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Symbol & Exchange */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium font-satoshi ${position.exchange === 'NSE'
                          ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                          }`}>
                          {position.exchange}
                        </div>
                        <div>
                          <h4 className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {position.symbol}
                          </h4>
                          <p className="text-xs opacity-70 font-satoshi">{position.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 text-center">
                      <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {position.quantity.toLocaleString()}
                      </p>
                    </div>

                    {/* Avg Price */}
                    <div className="col-span-1 text-center">
                      <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {formatCurrency(position.avgPrice)}
                      </p>
                    </div>

                    {/* Current Price */}
                    <div className="col-span-1 text-center">
                      <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {formatCurrency(position.currentPrice)}
                      </p>
                    </div>

                    {/* Value */}
                    <div className="col-span-1 text-center">
                      <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {formatCurrency(position.value)}
                      </p>
                    </div>

                    {/* P&L */}
                    <div className="col-span-2 text-center">
                      <div className={`px-3 py-2 rounded-lg ${getPnLBackground(position.pnl, isDarkMode)}`}>
                        <p className={`text-sm font-bold font-satoshi ${getPnLColor(position.pnl)}`}>
                          {formatCurrency(position.pnl)}
                        </p>
                        <p className={`text-xs font-satoshi ${getPnLColor(position.pnl)}`}>
                          {formatPercentage(position.pnlPercent)}
                        </p>
                      </div>
                    </div>

                    {/* P/E Ratio */}
                    <div className="col-span-1 text-center">
                      <p className={`text-sm font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {position.pe}
                      </p>
                    </div>

                    {/* Volume */}
                    <div className="col-span-1 text-center">
                      <p className={`text-sm font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {formatNumber(position.volume)}
                      </p>
                    </div>

                    {/* Risk Level */}
                    <div className="col-span-1 text-center">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${position.volatility < 0.15 ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                        position.volatility < 0.25 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
                        }`}>
                        {(position.volatility * 100).toFixed(1)}%
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto ${position.pnl > 0 ? 'bg-green-500' :
                        position.pnl < 0 ? 'bg-red-500' : 'bg-gray-500'
                        } animate-pulse`}></div>
                    </div>
                  </div>

                  {/* Additional Info Row */}
                  <div className="mt-3 pt-3 border-t border-opacity-20">
                    <div className="grid grid-cols-6 gap-4 text-xs opacity-70 font-satoshi">
                      <div className="text-center">
                        <span className="font-medium">Sector:</span> {position.sector}
                      </div>
                      <div className="text-center">
                        <span className="font-medium">Beta:</span> {position.beta}
                      </div>
                      <div className="text-center">
                        <span className="font-medium">Market Cap:</span> {formatNumber(position.marketCap)}
                      </div>
                      {position.dividend > 0 && (
                        <div className="text-center">
                          <span className="font-medium">Dividend:</span> {position.dividend}%
                        </div>
                      )}
                      <div className="text-center">
                        <span className="font-medium">Last Update:</span> {position.lastUpdate.toLocaleTimeString()}
                      </div>
                      <div className="text-center">
                        <span className="font-medium">Exchange:</span> {position.exchange}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${isDarkMode ? 'bg-white/10' : 'bg-black/5'} rounded-xl p-4 border ${isDarkMode ? 'border-white/20' : 'border-black/30'}`}>
        <h3 className="text-lg font-semibold font-ivy mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className={`px-4 py-2 rounded-lg font-medium font-satoshi transition-all duration-200 ${isDarkMode
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
            }`}>
            Add Position
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium font-satoshi transition-all duration-200 ${isDarkMode
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
            }`}>
            Rebalance
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium font-satoshi transition-all duration-200 ${isDarkMode
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
            }`}>
            Export Data
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium font-satoshi transition-all duration-200 ${isDarkMode
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
            }`}>
            Risk Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary

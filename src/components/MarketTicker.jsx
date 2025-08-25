import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MarketTicker = () => {
  const [tickerData, setTickerData] = useState([
    { symbol: 'MTN', price: 165.50, change: 2.45, volume: '1.2M' },
    { symbol: 'DANGOTE', price: 195.00, change: -1.23, volume: '850K' },
    { symbol: 'ZENITH', price: 28.75, change: 3.67, volume: '2.1M' },
    { symbol: 'GTCO', price: 42.30, change: 1.89, volume: '1.8M' },
    { symbol: 'ACCESS', price: 18.90, change: -0.52, volume: '3.2M' },
    { symbol: 'UBA', price: 15.45, change: 2.78, volume: '2.7M' },
    { symbol: 'FBNH', price: 22.80, change: -1.45, volume: '1.5M' },
    { symbol: 'WAPCO', price: 35.60, change: 0.89, volume: '950K' },
    { symbol: 'BUACEMENT', price: 125.00, change: 4.23, volume: '680K' },
    { symbol: 'SEPLAT', price: 1850.00, change: -2.15, volume: '120K' }
  ])

  const { isDarkMode } = useTheme()

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(ticker => ({
        ...ticker,
        price: ticker.price + (Math.random() - 0.5) * 2,
        change: ticker.change + (Math.random() - 0.5) * 0.5
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="glass rounded-lg p-6 animated-border theme-transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-ivy">Market Ticker</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-satoshi opacity-60">Live Updates</span>
          </div>
          <select className={`border rounded-lg px-3 py-1 text-sm font-satoshi transition-colors ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'}`}>
            <option>All Stocks</option>
            <option>Top Gainers</option>
            <option>Top Losers</option>
            <option>High Volume</option>
          </select>
        </div>
      </div>

      {/* Ticker Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b transition-colors ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
              <th className="text-left py-3 px-4 font-medium font-satoshi opacity-60">Symbol</th>
              <th className="text-right py-3 px-4 font-medium font-satoshi opacity-60">Price</th>
              <th className="text-right py-3 px-4 font-medium font-satoshi opacity-60">Change</th>
              <th className="text-right py-3 px-4 font-medium font-satoshi opacity-60">Change %</th>
              <th className="text-right py-3 px-4 font-medium font-satoshi opacity-60">Volume</th>
              <th className="text-right py-3 px-4 font-medium font-satoshi opacity-60">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {tickerData.map((ticker, index) => (
              <tr
                key={index}
                className={`border-b transition-colors hover:bg-opacity-5 ${isDarkMode ? 'border-white/5 hover:bg-white' : 'border-black/5 hover:bg-black'}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      <span className="text-sm font-bold font-ivy">{ticker.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold font-satoshi">{ticker.symbol}</p>
                      <p className="text-xs font-satoshi opacity-60">NSE</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-mono font-semibold font-satoshi">{formatCurrency(ticker.price)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-semibold font-satoshi ${ticker.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {ticker.change >= 0 ? '+' : ''}{formatCurrency(ticker.change)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-semibold font-satoshi ${ticker.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {ticker.change >= 0 ? '+' : ''}{((ticker.change / (ticker.price - ticker.change)) * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-satoshi opacity-80">{ticker.volume}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-satoshi opacity-80">₦{(ticker.price * 1000000).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Summary */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm mb-1 font-satoshi opacity-60">Total Volume</p>
            <p className="text-lg font-bold font-satoshi">₦15.2B</p>
          </div>
          <div className="text-center">
            <p className="text-sm mb-1 font-satoshi opacity-60">Advancing</p>
            <p className="text-lg font-bold text-green-500 font-satoshi">67</p>
          </div>
          <div className="text-center">
            <p className="text-sm mb-1 font-satoshi opacity-60">Declining</p>
            <p className="text-lg font-bold text-red-500 font-satoshi">23</p>
          </div>
          <div className="text-center">
            <p className="text-sm mb-1 font-satoshi opacity-60">Unchanged</p>
            <p className="text-lg font-bold font-satoshi">10</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className={`hover:bg-opacity-20 border rounded-lg px-4 py-2 text-sm transition-colors duration-200 font-satoshi ${isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-black/10 hover:bg-black/20 border-black/20'}`}>
              Export Data
            </button>
            <button className={`hover:bg-opacity-20 border rounded-lg px-4 py-2 text-sm transition-colors duration-200 font-satoshi ${isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-black/10 hover:bg-black/20 border-black/20'}`}>
              Set Alerts
            </button>
            <button className={`hover:bg-opacity-20 border rounded-lg px-4 py-2 text-sm transition-colors duration-200 font-satoshi ${isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-black/10 hover:bg-black/20 border-black/20'}`}>
              Watchlist
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-satoshi opacity-60">Last Updated</p>
            <p className="text-sm font-medium font-satoshi">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketTicker

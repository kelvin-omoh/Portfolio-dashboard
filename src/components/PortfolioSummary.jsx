import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

const PortfolioSummary = () => {
  const { portfolio, marketData } = useDashboard()
  const { isDarkMode } = useTheme()
  const [orders, setOrders] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [highlightedRows, setHighlightedRows] = useState(new Set())
  const [orderFlow, setOrderFlow] = useState({ buys: 0, sells: 0, volume: 0 })
  const [marketDepth, setMarketDepth] = useState({ bidCount: 0, askCount: 0 })
  const [systemLatency, setSystemLatency] = useState(0)

  // Generate initial trading orders
  useEffect(() => {
    const generateOrders = () => {
      const nseSymbols = ['MTNN', 'DANGCEM', 'ZENITHBANK', 'GTCO', 'ACCESSCORP', 'UBA', 'FBNH', 'NESTLE', 'UNILEVER', 'GUINNESS', 'BUACEMENT', 'SEPLAT', 'AIRTELAFRI', 'STANBIC', 'WAPCO']
      const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'XRPUSDT', 'LTCUSDT', 'DOGEUSDT']
      const allSymbols = [...nseSymbols, ...cryptoSymbols]
      const exchanges = ['NSE', 'Quidax']
      const orderTypes = ['market', 'limit']
      const positions = ['buy', 'sell']

      // Generate realistic trading session timestamp
      const sessionStart = new Date()
      sessionStart.setHours(9, 0, 0, 0) // Market opens at 9 AM

      return Array.from({ length: 75 }, (_, index) => {
        const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)]
        const isCrypto = cryptoSymbols.includes(symbol)
        const exchange = isCrypto ? 'Quidax' : 'NSE'
        const position = positions[Math.floor(Math.random() * positions.length)]
        const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)]

        // Realistic order amounts based on asset type
        const baseAmount = isCrypto ?
          Math.floor(Math.random() * 150000) + 20000 : // ₦20K - ₦170K for crypto
          Math.floor(Math.random() * 300000) + 50000 // ₦50K - ₦350K for stocks

        const filledAmount = Math.floor(baseAmount * Math.random() * 0.6) // Conservative fills
        const fraction = filledAmount / baseAmount

        // Realistic entry times - mix of recent and older orders
        const timeRange = Math.random() * 3600000 // Last hour
        const entryTime = new Date(Date.now() - timeRange)
        const fillTime = fraction >= 1 ? new Date(entryTime.getTime() + Math.random() * 300000) : null // Max 5 min fill
        const timeSpent = fillTime ? Math.floor((fillTime - entryTime) / 1000) : Math.floor((Date.now() - entryTime) / 1000)

        // Realistic latency ranges
        const latency = isCrypto ?
          Math.random() * 25 + 5 : // 5-30ms for crypto
          Math.random() * 15 + 2   // 2-17ms for equities

        // Generate realistic order ID
        const timestamp = entryTime.getTime().toString().slice(-6)
        const venue = exchange === 'NSE' ? 'NSE' : 'QDX'
        const side = position === 'buy' ? 'B' : 'S'
        const orderCounter = (index + 1).toString().padStart(4, '0')
        const realisticId = `${venue}${side}${timestamp}${orderCounter}`

        return {
          id: realisticId,
          symbol,
          position,
          amount: baseAmount,
          filledAmount,
          fraction,
          exchange,
          orderType,
          entryTime,
          fillTime,
          timeSpent,
          latency,
          status: fraction >= 1 ? 'filled' : fraction > 0 ? 'partial' : 'pending',
          priority: Math.random() > 0.8 ? 'high' : 'normal',
          venue: exchange,
          orderSize: baseAmount,
          avgFillPrice: isCrypto ?
            (Math.random() * 100000 + 10000).toFixed(2) : // ₦10K-₦110K for crypto
            (Math.random() * 500 + 50).toFixed(2), // ₦50-₦550 for stocks
          lastFillTime: new Date(),
          executionAlgo: Math.random() > 0.6 ? 'TWAP' : Math.random() > 0.3 ? 'VWAP' : 'POV'
        }
      })
    }

    setOrders(generateOrders())
  }, [])

  // Ultra-fast HFT updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updateStart = performance.now()
      setIsUpdating(true)

      setOrders(prevOrders => {
        let updatedOrders = [...prevOrders]

        // Aggressive order lifecycle - HFT style with continuous recycling
        updatedOrders = updatedOrders.filter(order => {
          if (order.status === 'filled') {
            return Math.random() > 0.4 // 40% chance to remove filled orders (faster turnover)
          }
          // Also remove very old orders to prevent accumulation
          const orderAge = (Date.now() - order.entryTime.getTime()) / 1000
          if (orderAge > 300) { // Remove orders older than 5 minutes
            return Math.random() > 0.6 // 60% chance to remove old orders
          }
          return true
        })

        // Maintain optimal order count - force recycling when needed
        if (updatedOrders.length > 85) {
          // Aggressively remove older orders when approaching limit
          updatedOrders = updatedOrders.slice(0, 60) // Keep only newest 60 orders
        }

        // Ultra-high frequency order injection with realistic data
        const newOrderCount = Math.floor(Math.random() * 6) + 3 // 3-8 new orders per cycle
        for (let i = 0; i < newOrderCount; i++) { // Remove length limit to ensure continuous flow
          if (Math.random() > 0.3) { // 70% chance to add new order
            const nseSymbols = ['MTNN', 'DANGCEM', 'ZENITHBANK', 'GTCO', 'ACCESSCORP', 'UBA', 'FBNH', 'NESTLE', 'UNILEVER', 'GUINNESS', 'BUACEMENT', 'SEPLAT', 'AIRTELAFRI', 'STANBIC', 'WAPCO']
            const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'XRPUSDT', 'LTCUSDT', 'DOGEUSDT']
            const allSymbols = [...nseSymbols, ...cryptoSymbols]

            const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)]
            const isCrypto = cryptoSymbols.includes(symbol)
            const exchange = isCrypto ? 'Quidax' : 'NSE'
            const position = Math.random() > 0.5 ? 'buy' : 'sell'
            const orderType = Math.random() > 0.7 ? 'limit' : 'market'

            // Realistic amounts
            const amount = isCrypto ?
              Math.floor(Math.random() * 150000) + 30000 : // ₦30K - ₦180K for crypto
              Math.floor(Math.random() * 250000) + 75000   // ₦75K - ₦325K for stocks

            const filledAmount = Math.floor(amount * Math.random() * 0.2) // Start mostly unfilled
            const fraction = filledAmount / amount
            // Generate entry time (0-2 minutes ago for new orders)
            const entryTime = new Date(Date.now() - (Math.random() * 120000))

            // Realistic latency
            const latency = isCrypto ?
              Math.random() * 30 + 8 : // 8-38ms for crypto
              Math.random() * 20 + 3   // 3-23ms for equities

            // Generate realistic order ID
            const timestamp = entryTime.getTime().toString().slice(-6)
            const venue = exchange === 'NSE' ? 'NSE' : 'QDX'
            const side = position === 'buy' ? 'B' : 'S'
            const orderCounter = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
            const realisticId = `${venue}${side}${timestamp}${orderCounter}`

            const newOrder = {
              id: realisticId,
              symbol,
              position,
              amount,
              filledAmount,
              fraction,
              exchange,
              orderType,
              entryTime,
              fillTime: null,
              timeSpent: 0,
              latency: latency,
              status: filledAmount > 0 ? 'partial' : 'pending',
              priority: Math.random() > 0.85 ? 'high' : 'normal',
              venue: exchange,
              orderSize: amount,
              avgFillPrice: isCrypto ?
                (Math.random() * 100000 + 10000).toFixed(2) : // ₦10K-₦110K for crypto
                (Math.random() * 500 + 50).toFixed(2), // ₦50-₦550 for stocks
              lastFillTime: new Date(),
              executionAlgo: Math.random() > 0.6 ? 'TWAP' : Math.random() > 0.3 ? 'VWAP' : 'POV'
            }

            updatedOrders.unshift(newOrder) // Add to beginning
          }
        }

        // Ensure minimum order count for continuous activity
        if (updatedOrders.length < 20) {
          // Force add orders if count gets too low
          const emergencyOrderCount = 25 - updatedOrders.length
          for (let i = 0; i < emergencyOrderCount; i++) {
            const nseSymbols = ['MTNN', 'DANGCEM', 'ZENITHBANK', 'GTCO', 'ACCESSCORP', 'UBA', 'FBNH', 'NESTLE', 'UNILEVER', 'GUINNESS', 'BUACEMENT', 'SEPLAT', 'AIRTELAFRI', 'STANBIC', 'WAPCO']
            const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'XRPUSDT', 'LTCUSDT', 'DOGEUSDT']
            const allSymbols = [...nseSymbols, ...cryptoSymbols]

            const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)]
            const isCrypto = cryptoSymbols.includes(symbol)
            const exchange = isCrypto ? 'Quidax' : 'NSE'
            const position = Math.random() > 0.5 ? 'buy' : 'sell'
            const orderType = Math.random() > 0.7 ? 'limit' : 'market'
            const amount = isCrypto ?
              Math.floor(Math.random() * 150000) + 30000 :
              Math.floor(Math.random() * 250000) + 75000
            const filledAmount = Math.floor(amount * Math.random() * 0.3)
            const fraction = filledAmount / amount
            // Generate realistic entry time (1-10 minutes ago for emergency orders)
            const entryTime = new Date(Date.now() - (Math.random() * 600000 + 60000))
            const latency = isCrypto ?
              Math.random() * 30 + 8 :
              Math.random() * 20 + 3

            const timestamp = entryTime.getTime().toString().slice(-6)
            const venue = exchange === 'NSE' ? 'NSE' : 'QDX'
            const side = position === 'buy' ? 'B' : 'S'
            const orderCounter = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
            const realisticId = `${venue}${side}${timestamp}${orderCounter}`

            const emergencyOrder = {
              id: realisticId,
              symbol, position, amount, filledAmount, fraction, exchange, orderType,
              entryTime, fillTime: null, timeSpent: 0, latency,
              status: filledAmount > 0 ? 'partial' : 'pending',
              priority: Math.random() > 0.85 ? 'high' : 'normal',
              venue: exchange, orderSize: amount,
              avgFillPrice: isCrypto ?
                (Math.random() * 100000 + 10000).toFixed(2) :
                (Math.random() * 500 + 50).toFixed(2),
              lastFillTime: new Date(),
              executionAlgo: Math.random() > 0.6 ? 'TWAP' : Math.random() > 0.3 ? 'VWAP' : 'POV'
            }

            updatedOrders.unshift(emergencyOrder)
          }
        }

        // Ultra-fast HFT order execution simulation
        const newHighlighted = new Set()
        const updatedOrdersWithHighlight = updatedOrders.map(order => {
          // Aggressive HFT progression - orders fill very quickly
          const fillSpeed = order.orderType === 'market' ? 0.8 : 0.4 // Market orders fill faster
          const progressIncrement = Math.random() * fillSpeed
          const newFilledAmount = Math.min(order.amount, order.filledAmount + (order.amount * progressIncrement))
          const newFraction = newFilledAmount / order.amount
          const currentTime = new Date()
          const newTimeSpent = Math.max(0, Math.floor((currentTime - order.entryTime) / 1000))

          // Ultra-low latency simulation (microseconds to milliseconds)
          const newLatency = Math.random() * 15 + 0.05 // 0.05ms to 15ms

          // Update market metrics
          const buys = updatedOrders.filter(o => o.position === 'buy').length
          const sells = updatedOrders.filter(o => o.position === 'sell').length
          const totalVolume = updatedOrders.reduce((sum, o) => sum + o.filledAmount, 0)

          setOrderFlow({ buys, sells, volume: totalVolume })
          setMarketDepth({
            bidCount: updatedOrders.filter(o => o.position === 'buy' && o.status !== 'filled').length,
            askCount: updatedOrders.filter(o => o.position === 'sell' && o.status !== 'filled').length
          })

          let newFillTime = order.fillTime
          let newStatus = order.status

          // Rapid status changes for HFT
          if (newFraction >= 1 && !order.fillTime) {
            newFillTime = currentTime
            newStatus = 'filled'
          } else if (newFraction > 0.8) {
            newStatus = 'partial'
          } else if (newFraction > 0.2) {
            newStatus = 'partial'
          }

          // Ultra-sensitive highlighting for constant activity
          if (
            Math.abs(newFilledAmount - order.filledAmount) > order.amount * 0.01 ||
            Math.abs(newLatency - order.latency) > 3 ||
            newStatus !== order.status ||
            Math.random() > 0.85 // More frequent random highlighting for activity
          ) {
            newHighlighted.add(order.id)
          }

          return {
            ...order,
            filledAmount: newFilledAmount,
            fraction: newFraction,
            fillTime: newFillTime,
            timeSpent: newTimeSpent,
            latency: newLatency,
            status: newStatus,
            lastFillTime: newFilledAmount > order.filledAmount ? currentTime : order.lastFillTime,
            avgFillPrice: (parseFloat(order.avgFillPrice) + (Math.random() - 0.5) * 10).toFixed(2)
          }
        })

        setHighlightedRows(newHighlighted)

        // Clear highlights after a very short delay for constant activity
        setTimeout(() => {
          setHighlightedRows(new Set())
        }, 100)

        return updatedOrdersWithHighlight
      })

      // Track system performance
      const updateEnd = performance.now()
      setSystemLatency(updateEnd - updateStart)

      setTimeout(() => setIsUpdating(false), 150)
    }, 200) // Fast updates - every 200ms (5 FPS for better visibility)

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

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString() : '-'
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const formatLatency = (latency) => {
    if (latency < 1) {
      return `${(latency * 1000).toFixed(0)}μs` // Microseconds
    } else if (latency < 1000) {
      return `${latency.toFixed(2)}ms` // Milliseconds
    } else {
      return `${(latency / 1000).toFixed(2)}s` // Seconds
    }
  }

  const formatVolume = (amount) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
    return amount.toFixed(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'filled': return 'text-green-500'
      case 'partial': return 'text-yellow-500'
      case 'pending': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getPositionColor = (position) => {
    return position === 'buy' ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className={`${isDarkMode ? 'glass' : 'card-light'} rounded-xl md:rounded-2xl p-4 md:p-8 animated-border theme-transition`}>
      {/* HFT Header with Real-time Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-ivy mb-1 md:mb-2">
            <span className="hidden sm:inline">HFT Order Management System</span>
            <span className="sm:hidden">HFT Orders</span>
            <span className={`ml-2 md:ml-3 px-2 py-1 text-xs rounded ${isUpdating ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {isUpdating ? 'LIVE' : 'IDLE'}
            </span>
          </h2>
          <p className="text-xs md:text-sm font-satoshi opacity-70 hidden sm:block">Ultra-low latency order execution • 100ms update cycle</p>
          <p className="text-xs font-satoshi opacity-70 sm:hidden">Real-time order execution</p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className={`px-3 py-2 rounded-lg text-center ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
            <div className="text-xs font-satoshi opacity-70">Active Orders</div>
            <div className="font-bold text-lg">{orders.filter(o => o.status !== 'filled').length}</div>
          </div>
          <div className={`px-3 py-2 rounded-lg text-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <div className="text-xs font-satoshi opacity-70">Buys/Sells</div>
            <div className="font-bold text-lg text-blue-400">{orderFlow.buys}/{orderFlow.sells}</div>
          </div>
          <div className={`px-3 py-2 rounded-lg text-center ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <div className="text-xs font-satoshi opacity-70">System Latency</div>
            <div className="font-bold text-lg text-green-400">{formatLatency(systemLatency)}</div>
          </div>
          <div className={`px-3 py-2 rounded-lg text-center ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <div className="text-xs font-satoshi opacity-70">Total Volume</div>
            <div className="font-bold text-lg text-purple-400">₦{formatVolume(orderFlow.volume)}</div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mb-6 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 text-center`}>
          <h3 className="text-sm font-satoshi opacity-70 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold font-satoshi">{orders.length}</p>
        </div>
        <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 text-center`}>
          <h3 className="text-sm font-satoshi opacity-70 mb-1">Filled Orders</h3>
          <p className="text-2xl font-bold font-satoshi text-green-500">{orders.filter(o => o.status === 'filled').length}</p>
        </div>
        <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 text-center`}>
          <h3 className="text-sm font-satoshi opacity-70 mb-1">Avg. Fill Rate</h3>
          <p className="text-2xl font-bold font-satoshi">
            {((orders.reduce((sum, o) => sum + o.fraction, 0) / orders.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 text-center`}>
          <h3 className="text-sm font-satoshi opacity-70 mb-1">Avg. Latency</h3>
          <p className="text-2xl font-bold font-satoshi">
            {Math.round(orders.reduce((sum, o) => sum + o.latency, 0) / orders.length)}ms
          </p>
        </div>
      </div>

      {/* Orders Display - Responsive */}
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className={`${isDarkMode ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm`}>
            <tr className={`border-b ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Position</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Amount</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Filled Amount</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Fraction</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Exchange</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Order Type</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">ID</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Entry Time</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Fill Time</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Time Spent</th>
              <th className="text-left py-4 px-3 font-satoshi font-semibold opacity-80">Latency</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isHighlighted = highlightedRows.has(order.id)
              const isNewOrder = index < 3 // Highlight first 3 rows as "new"

              return (
                <tr
                  key={order.id}
                  className={`border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'} 
                    hover:${isDarkMode ? 'bg-white/5' : 'bg-black/5'} 
                    transition-all duration-300
                    ${isHighlighted ?
                      (isDarkMode ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-blue-200/50 shadow-lg shadow-blue-200/50')
                      : ''
                    }
                    ${isNewOrder ?
                      (isDarkMode ? 'bg-green-500/10 animate-pulse' : 'bg-green-100/50 animate-pulse')
                      : ''
                    }
                  `}
                >
                  <td className="py-4 px-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getPositionColor(order.position)}`}>
                        {order.position.toUpperCase()}
                      </span>
                      <span className="font-satoshi font-medium">{order.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-satoshi font-medium">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-satoshi font-medium">{formatCurrency(order.filledAmount)}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-16 h-2 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${order.fraction * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-satoshi text-sm">{(order.fraction * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.exchange === 'NSE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {order.exchange}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.orderType === 'market' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="py-4 px-3 font-mono text-sm opacity-80">
                    {order.id}
                  </td>
                  <td className="py-4 px-3 font-satoshi text-sm">
                    {formatTime(order.entryTime)}
                  </td>
                  <td className="py-4 px-3 font-satoshi text-sm">
                    {formatTime(order.fillTime)}
                  </td>
                  <td className="py-4 px-3 font-mono text-sm">
                    {formatDuration(order.timeSpent)}
                  </td>
                  <td className="py-4 px-3">
                    <span className={`font-mono text-sm ${order.latency < 1 ? 'text-green-500' : order.latency < 10 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {formatLatency(order.latency)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {orders.slice(0, 15).map((order, index) => {
          const isHighlighted = highlightedRows.has(order.id)
          const isNewOrder = index < 3

          return (
            <div
              key={order.id}
              className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} 
                border rounded-xl p-4 transition-all duration-300
                ${isHighlighted ? 'bg-blue-500/20 border-blue-500/30 shadow-lg' : ''} 
                ${isNewOrder ? 'bg-green-500/10 border-green-500/30 animate-pulse' : ''}`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPositionColor(order.position)}`}>
                    {order.position.toUpperCase()}
                  </span>
                  <span className="font-satoshi font-semibold text-sm">{order.symbol}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${order.latency < 1 ? 'text-green-500' : order.latency < 10 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {formatLatency(order.latency)}
                  </div>
                  <div className="text-xs opacity-50 font-mono">#{order.id.slice(-6)}</div>
                </div>
              </div>

              {/* Exchange and Order Type */}
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${order.exchange === 'NSE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {order.exchange}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${order.orderType === 'market' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {order.orderType}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Amount Information */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs opacity-70 font-satoshi mb-1">Total Amount</div>
                  <div className="font-bold font-satoshi">{formatCurrency(order.amount)}</div>
                </div>
                <div>
                  <div className="text-xs opacity-70 font-satoshi mb-1">Filled Amount</div>
                  <div className="font-bold font-satoshi text-green-400">{formatCurrency(order.filledAmount)}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs opacity-70 font-satoshi">Fill Progress</span>
                  <span className="text-sm font-bold text-blue-400">
                    {(order.fraction * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/20'} overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 rounded-full"
                    style={{ width: `${order.fraction * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Time Information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="opacity-70 mb-1">Entry Time</div>
                  <div className="font-mono text-sm">{formatTime(order.entryTime)}</div>
                </div>
                <div>
                  <div className="opacity-70 mb-1">Duration</div>
                  <div className="font-mono text-sm">{formatDuration(order.timeSpent)}</div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Show More Orders Indicator */}
        {orders.length > 15 && (
          <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} 
            border rounded-xl p-4 text-center`}>
            <div className="text-sm font-satoshi opacity-70">
              Showing 15 of {orders.length} active orders
            </div>
            <div className="text-xs opacity-50 mt-1">
              Full table view available on desktop
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioSummary
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const PositionsTable = () => {
    const { isDarkMode } = useTheme()
    const [selectedExchange, setSelectedExchange] = useState('All')
    const [livePositions, setLivePositions] = useState([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    // Generate dynamic positions with real-time data
    useEffect(() => {
        const generatePositions = () => {
            const positions = [
                {
                    id: 1,
                    symbol: 'MTN',
                    name: 'MTN Nigeria',
                    shares: 1500,
                    exchange: 'NSE',
                    fraction: 0.15,
                    orderType: 'Market',
                    time: '09:30:15',
                    price: 245.50,
                    value: 368250,
                    change: 2.50,
                    changePercent: 1.03,
                    sector: 'Telecommunications',
                    volume: 2500000,
                    marketCap: 4500000000,
                    pe: 15.2,
                    dividend: 4.5,
                    beta: 1.1,
                    volatility: 0.18
                },
                {
                    id: 2,
                    symbol: 'DANGCEM',
                    name: 'Dangote Cement',
                    shares: 800,
                    exchange: 'NSE',
                    fraction: 0.08,
                    orderType: 'Limit',
                    time: '10:15:22',
                    price: 285.75,
                    value: 228600,
                    change: -1.25,
                    changePercent: -0.44,
                    sector: 'Industrial Goods',
                    volume: 1800000,
                    marketCap: 3200000000,
                    pe: 28.7,
                    dividend: 5.8,
                    beta: 0.9,
                    volatility: 0.22
                },
                {
                    id: 3,
                    symbol: 'ZENITH',
                    name: 'Zenith Bank',
                    shares: 2000,
                    exchange: 'NSE',
                    fraction: 0.20,
                    orderType: 'Market',
                    time: '11:45:08',
                    price: 32.80,
                    value: 65600,
                    change: 0.30,
                    changePercent: 0.92,
                    sector: 'Financial Services',
                    volume: 3200000,
                    marketCap: 1800000000,
                    pe: 12.5,
                    dividend: 6.2,
                    beta: 1.3,
                    volatility: 0.25
                },
                {
                    id: 4,
                    symbol: 'BTC',
                    name: 'Bitcoin',
                    shares: 0.85,
                    exchange: 'Quidax',
                    fraction: 0.85,
                    orderType: 'Limit',
                    time: '12:20:45',
                    price: 45000000,
                    value: 38250000,
                    change: 1250000,
                    changePercent: 2.86,
                    sector: 'Cryptocurrency',
                    volume: 8500000000,
                    marketCap: 850000000000,
                    pe: 0,
                    dividend: 0,
                    beta: 2.1,
                    volatility: 0.45
                },
                {
                    id: 5,
                    symbol: 'ETH',
                    name: 'Ethereum',
                    shares: 12.50,
                    exchange: 'Quidax',
                    fraction: 1.25,
                    orderType: 'Market',
                    time: '13:05:12',
                    price: 2800000,
                    value: 35000000,
                    change: -75000,
                    changePercent: -2.61,
                    sector: 'Cryptocurrency',
                    volume: 4200000000,
                    marketCap: 320000000000,
                    pe: 0,
                    dividend: 0,
                    beta: 1.8,
                    volatility: 0.38
                },
                {
                    id: 6,
                    symbol: 'GUARANTY',
                    name: 'Guaranty Trust Bank',
                    shares: 1200,
                    exchange: 'NSE',
                    fraction: 0.12,
                    orderType: 'Limit',
                    time: '14:30:33',
                    price: 28.45,
                    value: 34140,
                    change: 0.55,
                    changePercent: 1.97,
                    sector: 'Financial Services',
                    volume: 1500000,
                    marketCap: 950000000,
                    pe: 14.8,
                    dividend: 5.5,
                    beta: 1.2,
                    volatility: 0.20
                }
            ]

            return positions.map(pos => ({
                ...pos,
                lastUpdate: new Date(),
                isNew: false,
                priceHistory: [pos.price]
            }))
        }

        setLivePositions(generatePositions())
    }, [])

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setIsUpdating(true)

            setLivePositions(prev => prev.map(position => {
                const volatility = position.volatility
                const priceChange = (Math.random() - 0.5) * volatility * position.price * 0.1
                const newPrice = Math.max(position.price + priceChange, 0.01)
                const newChange = newPrice - position.price
                const newChangePercent = (newChange / position.price) * 100
                const newValue = newPrice * position.shares

                // Update time randomly
                const timeOptions = ['09:30:15', '10:15:22', '11:45:08', '12:20:45', '13:05:12', '14:30:33']
                const newTime = timeOptions[Math.floor(Math.random() * timeOptions.length)]

                return {
                    ...position,
                    price: newPrice,
                    value: newValue,
                    change: newChange,
                    changePercent: newChangePercent,
                    time: newTime,
                    lastUpdate: new Date(),
                    priceHistory: [...position.priceHistory.slice(-4), newPrice],
                    isNew: Math.random() > 0.8 // 20% chance to show as new
                }
            }))

            setLastUpdate(new Date())

            setTimeout(() => setIsUpdating(false), 500)
        }, 3000)

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

    const formatShares = (shares) => {
        if (shares < 1) return shares.toFixed(2)
        return shares.toLocaleString()
    }

    const formatPercentage = (num) => {
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
    }

    const getChangeColor = (change) => {
        if (change > 0) return 'text-green-500'
        if (change < 0) return 'text-red-500'
        return 'text-gray-400'
    }

    const getChangeBackground = (change, isDark) => {
        if (change > 0) return isDark ? 'bg-green-500/20' : 'bg-green-100'
        if (change < 0) return isDark ? 'bg-red-500/20' : 'bg-red-100'
        return isDark ? 'bg-gray-500/20' : 'bg-gray-100'
    }

    // Enhanced filtering with proper exchange matching
    const filteredPositions = selectedExchange === 'All'
        ? livePositions
        : livePositions.filter(pos => pos.exchange === selectedExchange)

    const totalPositions = filteredPositions.length
    const totalValue = filteredPositions.reduce((sum, pos) => sum + pos.value, 0)

    // Calculate actual portfolio fractions based on current values
    const positionsWithFractions = filteredPositions.map(pos => ({
        ...pos,
        actualFraction: totalValue > 0 ? (pos.value / totalValue) * 100 : 0
    }))

    // Debug logging
    console.log('Filter Debug:', {
        selectedExchange,
        totalPositions,
        totalValue,
        positions: positionsWithFractions.map(p => ({
            symbol: p.symbol,
            exchange: p.exchange,
            fraction: p.actualFraction.toFixed(2)
        }))
    })

    return (
        <div className={`${isDarkMode ? 'glass' : 'card-light'} rounded-2xl p-6 animated-border theme-transition`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-ivy mb-2">Portfolio Positions</h2>
                    <p className="text-sm font-satoshi opacity-70">Current holdings across exchanges</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-xs font-satoshi opacity-70">
                            {isUpdating ? 'Updating...' : 'Live'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-satoshi opacity-70">Last Update</p>
                        <p className="text-sm font-semibold font-satoshi">{lastUpdate.toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            {/* Filters and Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-satoshi opacity-70">Filter:</span>
                    <div className="flex space-x-2">
                        {['All', 'NSE', 'Quidax'].map((exchange) => (
                            <button
                                key={exchange}
                                onClick={() => setSelectedExchange(exchange)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium font-satoshi transition-all duration-200 ${selectedExchange === exchange
                                        ? isDarkMode
                                            ? 'bg-white text-black shadow-lg'
                                            : 'bg-black text-white shadow-lg'
                                        : isDarkMode
                                            ? 'bg-white/10 text-white/70 hover:bg-white/20'
                                            : 'bg-black/5 text-black/70 hover:bg-black/10'
                                    }`}
                            >
                                {exchange}
                                {exchange !== 'All' && (
                                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-opacity-20 bg-current">
                                        {livePositions.filter(pos => pos.exchange === exchange).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    {selectedExchange !== 'All' && (
                        <div className="ml-4 px-3 py-1 rounded-lg bg-opacity-10 bg-current">
                            <span className="text-xs font-satoshi opacity-70">
                                Showing {selectedExchange} positions only
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-center">
                        <p className="text-sm font-satoshi opacity-70 mb-1">Total Positions</p>
                        <p className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {totalPositions}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-satoshi opacity-70 mb-1">Total Value</p>
                        <p className={`text-xl font-bold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {formatCurrency(totalValue)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dynamic Positions Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    {/* Table Header */}
                    <div className={`${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-t-xl p-4 border-b ${isDarkMode ? 'border-white/20' : 'border-black/30'}`}>
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold font-satoshi">
                            <div className="col-span-2">Position</div>
                            <div className="col-span-1 text-center">Shares</div>
                            <div className="col-span-1 text-center">Exchange</div>
                            <div className="col-span-1 text-center">Fraction</div>
                            <div className="col-span-1 text-center">Order Type</div>
                            <div className="col-span-1 text-center">Time</div>
                            <div className="col-span-1 text-center">Price</div>
                            <div className="col-span-1 text-center">Value</div>
                            <div className="col-span-2 text-center">Change</div>
                            <div className="col-span-1 text-center">Status</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="space-y-2">
                        {positionsWithFractions.map((position) => (
                            <div
                                key={position.id}
                                className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 border ${isDarkMode ? 'border-white/10' : 'border-black/30'} transition-all duration-300 hover:shadow-lg ${position.isNew ? 'ring-2 ring-blue-500/50' : ''
                                    }`}
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Position */}
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

                                    {/* Shares */}
                                    <div className="col-span-1 text-center">
                                        <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            {formatShares(position.shares)}
                                        </p>
                                    </div>

                                    {/* Exchange */}
                                    <div className="col-span-1 text-center">
                                        <div className={`px-2 py-1 rounded text-xs font-medium font-satoshi ${position.exchange === 'NSE'
                                            ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                                            : isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {position.exchange}
                                        </div>
                                    </div>

                                    {/* Fraction */}
                                    <div className="col-span-1 text-center">
                                        <p className={`text-sm font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            {position.actualFraction.toFixed(2)}%
                                        </p>
                                    </div>

                                    {/* Order Type */}
                                    <div className="col-span-1 text-center">
                                        <div className={`px-2 py-1 rounded text-xs font-medium font-satoshi ${position.orderType === 'Market'
                                            ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                                            : isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {position.orderType}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-1 text-center">
                                        <p className={`text-sm font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            {position.time}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-1 text-center">
                                        <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            {formatCurrency(position.price)}
                                        </p>
                                    </div>

                                    {/* Value */}
                                    <div className="col-span-1 text-center">
                                        <p className={`font-semibold font-satoshi ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            {formatCurrency(position.value)}
                                        </p>
                                    </div>

                                    {/* Change */}
                                    <div className="col-span-2 text-center">
                                        <div className={`px-3 py-2 rounded-lg ${getChangeBackground(position.change, isDarkMode)}`}>
                                            <p className={`text-sm font-bold font-satoshi ${getChangeColor(position.change)}`}>
                                                {formatCurrency(position.change)}
                                            </p>
                                            <p className={`text-xs font-satoshi ${getChangeColor(position.change)}`}>
                                                {formatPercentage(position.changePercent)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-1 text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto ${position.change > 0 ? 'bg-green-500' :
                                            position.change < 0 ? 'bg-red-500' : 'bg-gray-500'
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
                                            <span className="font-medium">Vol:</span> {(position.volatility * 100).toFixed(1)}%
                                        </div>
                                        {position.pe > 0 && (
                                            <div className="text-center">
                                                <span className="font-medium">P/E:</span> {position.pe}
                                            </div>
                                        )}
                                        {position.dividend > 0 && (
                                            <div className="text-center">
                                                <span className="font-medium">Div:</span> {position.dividend}%
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <span className="font-medium">Updated:</span> {position.lastUpdate.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PositionsTable

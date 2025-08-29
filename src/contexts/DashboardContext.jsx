import { createContext, useContext, useState, useEffect } from 'react'

const DashboardContext = createContext()

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

export const DashboardProvider = ({ children }) => {
  const [exchanges, setExchanges] = useState([
    {
      id: 'nse',
      name: 'Nigeria Stock Exchange',
      status: 'active',
      lastUpdate: new Date(),
      volume: 1250000000,
      change: 2.45
    },
    {
      id: 'quidax',
      name: 'Quidax',
      status: 'active',
      lastUpdate: new Date(),
      volume: 850000000,
      change: -1.23
    }
  ])

  const [portfolio, setPortfolio] = useState({
    totalValue: 2546720,
    dailyChange: 127340,
    dailyChangePercent: 4.99,
    positions: [
      { symbol: 'MTN', quantity: 1000, avgPrice: 150, currentPrice: 165, change: 10.0 },
      { symbol: 'DANGOTE', quantity: 500, avgPrice: 200, currentPrice: 212, change: 6.0 },
      { symbol: 'ZENITH', quantity: 800, avgPrice: 25, currentPrice: 28, change: 12.0 }
    ]
  })

  const [marketData, setMarketData] = useState({
    nse: {
      allShareIndex: 51234.56,
      marketCap: 28500000000000,
      volume: 1250000000,
      gainers: 45,
      losers: 23
    },
    quidax: {
      btcPrice: 45000000,
      ethPrice: 3200000,
      volume: 850000000,
      marketCap: 1250000000000
    }
  })

  const [chartData, setChartData] = useState({
    portfolio: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Portfolio Value',
        data: [2040000, 2185000, 2245000, 2397000, 2481000, 2546720],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4
      }]
    },
    roi: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'ROI %',
        data: [0, 7.1, 2.7, 6.8, 3.5, 2.6],
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        tension: 0.4
      }]
    }
  })

  // Ultra-fast real-time data updates - continuous streams
  useEffect(() => {
    const portfolioInterval = setInterval(() => {
      setPortfolio(prev => {
        // Always profitable - slight upward bias with occasional small dips
        const valueChange = Math.random() > 0.8
          ? -(Math.random() * 15000) // Small dip 20% of the time
          : Math.random() * 35000    // Growth 80% of the time

        const changeVariation = Math.random() > 0.8
          ? -(Math.random() * 8000)  // Small negative change 20% of the time
          : Math.random() * 18000    // Positive change 80% of the time

        const newDailyChange = Math.max(prev.dailyChange + changeVariation, 50000) // Never go below 50k daily profit
        const newTotalValue = Math.min(Math.max(prev.totalValue + valueChange, 2400000), 2580000) // Between 2.4M and 2.58M
        const newChangePercent = (newDailyChange / newTotalValue) * 100

        return {
          ...prev,
          totalValue: newTotalValue,
          dailyChange: newDailyChange,
          dailyChangePercent: Math.max(newChangePercent, 1.8) // Always at least 1.8% positive
        }
      })
    }, 1000) // Update every second

    const marketInterval = setInterval(() => {
      setMarketData(prev => ({
        nse: {
          ...prev.nse,
          allShareIndex: prev.nse.allShareIndex + (Math.random() - 0.5) * 50,
          volume: prev.nse.volume + Math.floor(Math.random() * 5000000),
          marketCap: prev.nse.marketCap + (Math.random() - 0.5) * 100000000000
        },
        quidax: {
          ...prev.quidax,
          btcPrice: prev.quidax.btcPrice + (Math.random() - 0.5) * 500000,
          ethPrice: prev.quidax.ethPrice + (Math.random() - 0.5) * 50000,
          volume: prev.quidax.volume + Math.floor(Math.random() * 2000000),
          marketCap: prev.quidax.marketCap + (Math.random() - 0.5) * 50000000000
        }
      }))
    }, 1500) // Market data every 1.5 seconds

    return () => {
      clearInterval(portfolioInterval)
      clearInterval(marketInterval)
    }
  }, [])

  const value = {
    exchanges,
    portfolio,
    marketData,
    chartData,
    setExchanges,
    setPortfolio,
    setMarketData,
    setChartData
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

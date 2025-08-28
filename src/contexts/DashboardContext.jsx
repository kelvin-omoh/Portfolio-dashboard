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
    dailyChangePercent: 5.26,
    positions: [
      { symbol: 'MTN', quantity: 1000, avgPrice: 150, currentPrice: 165, change: 10.0 },
      { symbol: 'DANGOTE', quantity: 500, avgPrice: 200, currentPrice: 195, change: -2.5 },
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
        data: [2040000, 2185000, 1968000, 2297000, 2418000, 2546720],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4
      }]
    },
    roi: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'ROI %',
        data: [0, 7.5, -1.0, 13.6, 4.4, 6.4],
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        tension: 0.4
      }]
    }
  })

  // Ultra-fast real-time data updates - continuous streams
  useEffect(() => {
    const portfolioInterval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 50000,
        dailyChange: prev.dailyChange + (Math.random() - 0.5) * 25000,
        dailyChangePercent: prev.dailyChangePercent + (Math.random() - 0.5) * 0.5
      }))
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

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
    totalValue: 25000000,
    dailyChange: 1250000,
    dailyChangePercent: 5.25,
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
        data: [20000000, 21500000, 19800000, 22500000, 23500000, 25000000],
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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 100000,
        dailyChange: prev.dailyChange + (Math.random() - 0.5) * 50000
      }))
    }, 5000)

    return () => clearInterval(interval)
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

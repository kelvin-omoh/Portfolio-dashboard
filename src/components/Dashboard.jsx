import React from 'react'
import Header from './Header'
import PortfolioSummary from './PortfolioSummary'
import PortfolioChart from './PortfolioChart'
import ROIChart from './ROIChart'
import MarketTicker from './MarketTicker'
import ExchangeOverview from './ExchangeOverview'
import PositionsTable from './PositionsTable'
import { useTheme } from '../contexts/ThemeContext'

const Dashboard = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} theme-transition`}>
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Portfolio Summary - Full Width Section */}
        <div className="mb-8">
          <PortfolioSummary />
        </div>

        {/* Portfolio Performance - Full Width Section */}
        <div className="mb-8">
          <PortfolioChart />
        </div>

        {/* Exchange Overview - Full Width Section */}
        <div className="mb-8">
          <ExchangeOverview />
        </div>

        {/* Positions Table - Full Width Section */}
        <div className="mb-8">
          <PositionsTable />
        </div>

        {/* ROI Chart - Full Width Section */}
        <div className="mb-8">
          <ROIChart />
        </div>

        {/* Market Ticker - Full Width Section */}
        <div className="mb-8">
          <MarketTicker />
        </div>
      </main>
    </div>
  )
}

export default Dashboard

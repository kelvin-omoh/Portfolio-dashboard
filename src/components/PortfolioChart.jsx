import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PortfolioChart = () => {
  const { chartData } = useDashboard()
  const { isDarkMode } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState('1Y')
  const [chartError, setChartError] = useState(null)

  // Enhanced chart data with more realistic values
  const periods = {
    '6M': {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [1250000, 1320000, 1280000, 1410000, 1380000, 1450000]
    },
    '1Y': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [1000000, 1050000, 980000, 1120000, 1080000, 1150000, 1250000, 1320000, 1280000, 1410000, 1380000, 1450000]
    },
    '3Y': {
      labels: ['2021', '2022', '2023'],
      data: [800000, 1200000, 1450000]
    },
    'ALL': {
      labels: ['2019', '2020', '2021', '2022', '2023'],
      data: [600000, 750000, 800000, 1200000, 1450000]
    }
  }

  const currentPeriod = periods[selectedPeriod]
  const chartPoints = currentPeriod.data
  const maxValue = Math.max(...chartPoints)
  const minValue = Math.min(...chartPoints)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculatePerformance = () => {
    const startValue = chartPoints[0]
    const endValue = chartPoints[chartPoints.length - 1]
    const absoluteChange = endValue - startValue
    const percentageChange = (absoluteChange / startValue) * 100
    return { absoluteChange, percentageChange }
  }

  const { absoluteChange, percentageChange } = calculatePerformance()

  // Generate benchmark data (8% annual growth)
  const generateBenchmarkData = () => {
    const startValue = chartPoints[0]
    return chartPoints.map((_, index) => {
      const annualGrowth = 0.08
      const timeFactor = index / (chartPoints.length - 1)
      return startValue * Math.pow(1 + annualGrowth, timeFactor)
    })
  }

  // Chart.js configuration
  const chartDataConfig = {
    labels: currentPeriod.labels,
    datasets: [
      {
        label: 'Portfolio',
        data: chartPoints,
        borderColor: isDarkMode ? '#ffffff' : '#000000',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? '#ffffff' : '#000000',
        pointBorderColor: isDarkMode ? '#ffffff' : '#000000',
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: isDarkMode ? '#ffffff' : '#000000',
        pointHoverBorderColor: isDarkMode ? '#ffffff' : '#000000',
      },
      {
        label: 'Benchmark',
        data: generateBenchmarkData(),
        borderColor: isDarkMode ? '#60a5fa' : '#1e40af',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 2.5,
        fill: false,
        tension: 0.4,
        borderDash: [8, 8],
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isDarkMode ? '#60a5fa' : '#1e40af',
        pointHoverBorderColor: isDarkMode ? '#60a5fa' : '#1e40af',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Hide legend since we have custom indicators
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Portfolio') {
              return `Portfolio: ${formatCurrency(context.parsed.y)}`
            } else {
              return `Benchmark: ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            family: 'Satoshi',
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            family: 'Satoshi',
            size: 12,
            weight: '500'
          },
          callback: function (value) {
            return formatCurrency(value)
          }
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    }
  }

  // Error boundary for chart
  useEffect(() => {
    try {
      // Test if Chart.js is working
      if (typeof ChartJS !== 'undefined') {
        setChartError(null)
      }
    } catch (error) {
      console.error('Chart.js error:', error)
      setChartError(error.message)
    }
  }, [])

  return (
    <div className="glass rounded-lg p-6 animated-border h-full theme-transition">
      {/* Header with controls */}
      <div className={`${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-xl p-4 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold font-ivy ${isDarkMode ? 'text-white' : 'text-black'}`}>Portfolio Performance</h2>
            <p className="text-sm font-satoshi opacity-60 mt-1">Track your investment growth over time</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Legend */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                <span className="text-xs font-satoshi opacity-60">Portfolio</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs font-satoshi opacity-60">Benchmark</span>
              </div>
            </div>

            {/* Period selector */}
            <div className="flex bg-opacity-10 rounded-lg p-1">
              {Object.keys(periods).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all font-satoshi ${selectedPeriod === period
                    ? isDarkMode
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : 'opacity-60 hover:opacity-80'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Starting Value</p>
          <p className="text-base font-bold font-satoshi">{formatCurrency(chartPoints[0])}</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Current Value</p>
          <p className="text-base font-bold font-satoshi">{formatCurrency(chartPoints[chartPoints.length - 1])}</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Total Return</p>
          <p className={`text-base font-bold font-satoshi ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? '+' : ''}{formatCurrency(absoluteChange)}
          </p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Return %</p>
          <p className={`text-base font-bold font-satoshi ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className={`relative h-72 mb-6 rounded-lg p-4 ${isDarkMode
        ? 'bg-gray-900 border border-white/20'
        : 'bg-gray-100 border border-black/20'
        }`}>
        {chartError ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 font-satoshi mb-2">Chart Error: {chartError}</p>
              <p className="text-sm opacity-60 font-satoshi">Please refresh the page</p>
            </div>
          </div>
        ) : (
          <Line data={chartDataConfig} options={chartOptions} />
        )}
      </div>

      {/* Performance Metrics - compact and elegant */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs mb-1 font-satoshi opacity-60">Sharpe Ratio</p>
          <p className="text-sm font-bold font-satoshi">1.85</p>
          <p className="text-xs font-satoshi text-green-500">+0.12</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs mb-1 font-satoshi opacity-60">Max Drawdown</p>
          <p className="text-sm font-bold text-red-500 font-satoshi">-8.2%</p>
          <p className="text-xs font-satoshi text-green-500">3mo recovery</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs mb-1 font-satoshi opacity-60">Volatility</p>
          <p className="text-sm font-bold font-satoshi">12.4%</p>
          <p className="text-xs font-satoshi text-green-500">Below avg</p>
        </div>
      </div>

      {/* Additional Insights - refined layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <h4 className="font-semibold mb-2 text-sm font-ivy">Best Period</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-satoshi opacity-60">Month</span>
              <span className="text-xs font-medium font-satoshi">Oct 2023</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-satoshi opacity-60">Return</span>
              <span className="text-xs font-medium text-green-500 font-satoshi">+10.2%</span>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <h4 className="font-semibold mb-2 text-sm font-ivy">Risk Metrics</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-satoshi opacity-60">Beta</span>
              <span className="text-xs font-medium font-satoshi">0.85</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-satoshi opacity-60">Alpha</span>
              <span className="text-xs font-medium text-green-500 font-satoshi">+2.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioChart

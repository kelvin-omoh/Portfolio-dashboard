import { useDashboard } from '../contexts/DashboardContext'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ROIChart = () => {
  const { chartData } = useDashboard()
  const { isDarkMode } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState('1Y')
  const [chartError, setChartError] = useState(null)

  // Enhanced ROI data with more realistic values
  const periods = {
    '6M': {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [2.8, 4.2, -1.5, 6.8, 3.2, 5.1]
    },
    '1Y': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [3.2, 2.1, -2.8, 4.5, 1.8, 3.9, 2.8, 4.2, -1.5, 6.8, 3.2, 5.1]
    },
    '3Y': {
      labels: ['2021', '2022', '2023'],
      data: [18.5, -8.2, 24.7]
    },
    'ALL': {
      labels: ['2019', '2020', '2021', '2022', '2023'],
      data: [12.3, 8.9, 18.5, -8.2, 24.7]
    }
  }

  const currentPeriod = periods[selectedPeriod]
  const roiData = currentPeriod.data
  const maxROI = Math.max(...roiData)
  const minROI = Math.min(...roiData)

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Simplified Chart.js configuration
  const chartDataConfig = {
    labels: currentPeriod.labels,
    datasets: [
      {
        label: 'ROI %',
        data: roiData,
        backgroundColor: roiData.map(value =>
          value >= 0
            ? (isDarkMode ? 'rgba(34, 197, 94, 0.9)' : 'rgba(34, 197, 94, 0.8)')
            : (isDarkMode ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.8)')
        ),
        borderColor: roiData.map(value =>
          value >= 0
            ? (isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 1)')
            : (isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)')
        ),
        borderWidth: 3,
        borderRadius: 6,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        callbacks: {
          label: function (context) {
            return `ROI: ${formatPercentage(context.parsed.y)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
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
            return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
          }
        }
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
    <div className="glass rounded-lg p-6 animated-border theme-transition">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-ivy">Return on Investment (ROI)</h2>
          <p className="text-sm font-satoshi opacity-60 mt-1">Monthly performance analysis</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Legend */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-satoshi opacity-60">Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs font-satoshi opacity-60">Negative</span>
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

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Average ROI</p>
          <p className="text-base font-bold text-green-500 font-satoshi">
            {formatPercentage(roiData.reduce((a, b) => a + b, 0) / roiData.length)}
          </p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Best Month</p>
          <p className="text-base font-bold text-green-500 font-satoshi">{formatPercentage(maxROI)}</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Worst Month</p>
          <p className="text-base font-bold text-red-500 font-satoshi">{formatPercentage(minROI)}</p>
        </div>
        <div className={`rounded-lg p-3 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <p className="text-xs font-satoshi opacity-60">Win Rate</p>
          <p className="text-base font-bold font-satoshi">
            {((roiData.filter(roi => roi > 0).length / roiData.length) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* ROI Chart with Chart.js */}
      <div className={`h-64 mb-6 rounded-lg p-4 ${isDarkMode
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
          <Bar data={chartDataConfig} options={chartOptions} />
        )}
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-lg p-4 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <h3 className="text-lg font-semibold mb-3 font-ivy">ROI Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">High Growth (&gt;5%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-500 font-medium font-satoshi">
                  {roiData.filter(roi => roi > 5).length} months
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Moderate Growth (1-5%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-medium font-satoshi">
                  {roiData.filter(roi => roi > 1 && roi <= 5).length} months
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Stable (-1 to 1%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-400 font-medium font-satoshi">
                  {roiData.filter(roi => roi >= -1 && roi <= 1).length} months
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Decline (&lt;-1%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-medium font-satoshi">
                  {roiData.filter(roi => roi < -1).length} months
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <h3 className="text-lg font-semibold mb-3 font-ivy">Risk Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Standard Deviation</span>
              <span className="font-medium font-satoshi">4.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Sharpe Ratio</span>
              <span className="font-medium text-green-500 font-satoshi">1.85</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Max Drawdown</span>
              <span className="text-base font-bold text-red-500 font-satoshi">-8.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-satoshi opacity-60">Win Rate</span>
              <span className="font-medium text-green-500 font-satoshi">
                {((roiData.filter(roi => roi > 0).length / roiData.length) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ROIChart

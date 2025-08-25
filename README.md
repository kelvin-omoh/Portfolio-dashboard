# Quant Analytics Dashboard

A professional quantitative analysis dashboard application built with React, Vite, and Tailwind CSS. This dashboard provides real-time portfolio tracking, market analysis, and performance metrics for Nigerian Stock Exchange (NSE) and Quidax cryptocurrency trading.

## Features

- 📊 **Exchange Overview** - Real-time data from NSE and Quidax
- 💰 **Portfolio Summary** - Comprehensive position tracking and allocation
- 📈 **Portfolio Performance** - Interactive charts and performance metrics
- 📊 **ROI Analysis** - Return on investment tracking and risk metrics
- 📰 **Market Ticker** - Live market data with real-time updates
- 🎨 **Professional UI** - Black and white grid hash layout with glass morphism
- ⚡ **Real-time Updates** - Simulated live data updates every 3-5 seconds
- 🔤 **Premium Typography** - Satoshi and Ivy Mode fonts for professional appearance
- 🌓 **Theme Switching** - Light and dark mode with smooth transitions

## Exchange Coverage

### Nigeria Stock Exchange (NSE)
- All Share Index tracking
- Market capitalization data
- Volume analysis
- Market sentiment (gainers/losers)

### Quidax
- Bitcoin (BTC) and Ethereum (ETH) prices
- Cryptocurrency market data
- 24-hour volume tracking

## Portfolio Features

- **Position Tracking**: MTN, DANGOTE, ZENITH, and more
- **Performance Metrics**: Sharpe ratio, volatility, max drawdown
- **Allocation Analysis**: Visual portfolio distribution
- **Real-time Updates**: Simulated live portfolio value changes

## Technical Architecture

### Separation of Concerns
- **Context Layer**: `DashboardContext` for state management, `ThemeContext` for theme switching
- **Component Layer**: Modular, reusable components
- **Utility Layer**: Common formatting and calculation functions
- **Styling Layer**: Tailwind CSS with custom CSS for grid hash background and theming

### Component Structure
```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard layout
│   ├── Header.jsx             # Dashboard header with portfolio summary and theme toggle
│   ├── ExchangeOverview.jsx   # NSE and Quidax data display
│   ├── PortfolioSummary.jsx   # Portfolio positions and metrics
│   ├── PortfolioChart.jsx     # Portfolio performance visualization
│   ├── ROIChart.jsx           # Return on investment analysis
│   └── MarketTicker.jsx       # Live market data table
├── contexts/
│   ├── DashboardContext.jsx   # State management and data
│   └── ThemeContext.jsx       # Theme management (light/dark mode)
├── utils/
│   └── formatters.js          # Common formatting functions
└── App.jsx                    # Application entry point
```

## Styling Features

- **Grid Hash Background**: Sophisticated black and white grid pattern
- **Glass Morphism**: Semi-transparent components with backdrop blur
- **Animated Borders**: Subtle animated border effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Custom Scrollbars**: Styled scrollbars matching the theme
- **Premium Typography**: 
  - **Satoshi**: Modern sans-serif for body text and data
  - **Ivy Mode**: Elegant serif for headings and titles
- **Theme System**: 
  - **Dark Mode**: Classic black background with white text
  - **Light Mode**: Clean white background with black text
  - **Smooth Transitions**: All theme changes animate smoothly
  - **Persistent Storage**: Theme preference saved to localStorage

## Getting Started

### Prerequisites

- **Node.js** version 18.18.0 or higher (but less than 20.19.0)
- npm or yarn

> **Note**: This project uses Vite 4 which is compatible with Node.js 18+. For the latest Vite 7, you would need Node.js 20.19+ or 22.12+.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Technologies Used

- **Vite 4.5.14** - Build tool and dev server
- **React 18.3.1** - UI library
- **Tailwind CSS 3.4.17** - CSS framework
- **PostCSS 8.5.6** - CSS processing
- **ESLint** - Code linting
- **Satoshi Font** - Modern sans-serif for optimal readability
- **Ivy Mode Font** - Elegant serif for professional headings
- **CSS Custom Properties** - Dynamic theming system

## Customization

### Adding New Exchanges
Modify the `exchanges` array in `DashboardContext.jsx` to add new trading platforms.

### Portfolio Positions
Update the `portfolio.positions` array to include your actual holdings.

### Chart Data
Modify the `chartData` object to use real data sources or different time periods.

### Styling
Customize the grid hash background by modifying the CSS in `src/App.css`.

### Typography
The dashboard uses Satoshi and Ivy Mode fonts for a professional appearance. These fonts are loaded from Google Fonts and can be customized in `src/index.css`.

### Theme Customization
The theme system uses CSS custom properties that can be modified in `src/index.css`. You can:
- Add new color schemes
- Modify existing light/dark themes
- Create custom theme variants
- Adjust transition timing

## Data Sources

Currently, the dashboard uses simulated data for demonstration purposes. To integrate with real data:

1. **NSE Data**: Connect to NSE APIs or data providers
2. **Quidax Data**: Integrate with Quidax API endpoints
3. **Portfolio Data**: Connect to your broker's API or trading platform
4. **Real-time Updates**: Implement WebSocket connections for live data

## Performance Features

- **Lazy Loading**: Components load as needed
- **Optimized Re-renders**: Context-based state management
- **Efficient Charts**: SVG-based chart rendering
- **Responsive Updates**: Smooth animations and transitions
- **Theme Persistence**: Theme preference saved locally for faster loading

## License

This project is private and proprietary.

## Contributing

This is a professional dashboard application. Please ensure all contributions maintain the high-quality standards and professional appearance of the application.

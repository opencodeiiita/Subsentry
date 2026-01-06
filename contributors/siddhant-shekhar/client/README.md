# SubSentry Client

A modern, responsive React application for subscription management with a beautiful UI and smooth animations.

## Features

### 🎯 Core Features
- **Subscription Listing**: Complete subscription management with grid/list views
- **Smart Filtering**: Filter by status, category, trial type, and date ranges
- **Advanced Search**: Real-time search across subscription names
- **Sorting Options**: Sort by renewal date, amount, name, or creation date
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 UI/UX Excellence
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Interactive Elements**: Hover states, loading spinners, and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Empty States**: Helpful empty states with actionable guidance

### 📊 Dashboard Features
- **Statistics Overview**: Real-time spending analytics and subscription counts
- **Upcoming Renewals**: Smart alerts for subscriptions renewing soon
- **Trial Alerts**: Notifications for trials ending within 3 days
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Timeline of subscription changes

### 🔧 Technical Features
- **Real-time Data**: Custom hooks for efficient data fetching
- **Error Handling**: Graceful error states with retry functionality
- **Mock Data**: Fallback demo data for development and testing
- **Performance**: Optimized rendering with React best practices

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **Date-fns** - Modern date utility library

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Header.jsx      # Top navigation bar
│   ├── SubscriptionCard.jsx    # Grid view card component
│   ├── SubscriptionTable.jsx   # List view table component
│   ├── StatsCards.jsx  # Dashboard statistics
│   ├── FilterPanel.jsx # Advanced filtering UI
│   ├── EmptyState.jsx  # Empty state illustrations
│   └── LoadingSpinner.jsx      # Loading indicators
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Subscriptions.jsx       # Subscription listing
│   └── Settings.jsx    # User settings
├── hooks/              # Custom React hooks
│   └── useSubscriptions.js     # Subscription data management
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Key Components

### Subscription Management
- **Grid View**: Card-based layout with hover animations
- **List View**: Compact table format for detailed information
- **Status Badges**: Visual indicators for active, paused, cancelled states
- **Urgent Renewals**: Highlighted subscriptions renewing within 3 days
- **Trial Indicators**: Special badges and alerts for trial subscriptions

### Navigation
- **Responsive Sidebar**: Collapsible navigation with active states
- **Mobile Menu**: Touch-friendly mobile navigation
- **Breadcrumbs**: Clear navigation hierarchy
- **Quick Actions**: Prominent call-to-action buttons

### Data Visualization
- **Statistics Cards**: Key metrics with trend indicators
- **Progress Indicators**: Visual spending breakdowns
- **Calendar Integration**: Renewal date visualization
- **Category Grouping**: Organized subscription categories

## API Integration

The application connects to the SubSentry backend API:

- **GET /api/subscriptions** - Fetch user subscriptions with filtering
- **GET /api/test/subscriptions** - Demo endpoint with mock data
- Supports pagination, sorting, and advanced filtering
- Includes summary statistics and analytics

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablet screens  
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Large touch targets and gestures

## Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: Efficient asset loading
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Search**: Optimized search input handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript-style JSDoc comments for better IDE support
3. Ensure responsive design across all screen sizes
4. Add proper accessibility attributes
5. Test on multiple browsers and devices

## License

This project is part of the SubSentry application suite.
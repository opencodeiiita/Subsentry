import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatsCards from '../components/StatsCards'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { format, isAfter, isBefore, addDays } from 'date-fns'

export default function Dashboard() {
  const { subscriptions, summary, loading } = useSubscriptions({ 
    includeSummary: true,
    limit: 5 
  })

  // Get upcoming renewals (next 7 days)
  const upcomingRenewals = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewalDate)
    const sevenDaysFromNow = addDays(new Date(), 7)
    return isAfter(sevenDaysFromNow, renewalDate) && isAfter(renewalDate, new Date())
  }).sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))

  // Get trial subscriptions ending soon
  const endingTrials = subscriptions.filter(sub => {
    if (!sub.isTrial || !sub.trialEndsAt) return false
    const trialEndDate = new Date(sub.trialEndsAt)
    const threeDaysFromNow = addDays(new Date(), 3)
    return isAfter(threeDaysFromNow, trialEndDate) && isAfter(trialEndDate, new Date())
  })

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your subscription management
        </p>
      </div>

      {/* Stats Cards */}
      {summary && <StatsCards summary={summary} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Renewals
              </h3>
            </div>
            <Link 
              to="/subscriptions"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {upcomingRenewals.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No renewals in the next 7 days
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingRenewals.slice(0, 5).map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {subscription.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(subscription.renewalDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatAmount(subscription.amount, subscription.currency)}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {subscription.billingCycle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Trial Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Trial Alerts
            </h3>
          </div>

          {endingTrials.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No trials ending soon
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {endingTrials.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {subscription.name}
                    </div>
                    <div className="text-sm text-warning-700">
                      Trial ends {format(new Date(subscription.trialEndsAt), 'MMM d')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatAmount(subscription.amount, subscription.currency)}
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </button>
          
          <Link to="/subscriptions" className="btn-secondary justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            View All Subscriptions
          </Link>
          
          <button className="btn-secondary justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </button>
          
          <button className="btn-secondary justify-start">
            <DollarSign className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Netflix subscription renewed successfully
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Added new subscription: GitHub Pro
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Notion Pro subscription paused
              </p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
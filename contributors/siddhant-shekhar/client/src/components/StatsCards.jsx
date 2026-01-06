import { motion } from 'framer-motion'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Crown,
  Play,
  Pause,
  XCircle
} from 'lucide-react'

export default function StatsCards({ summary }) {
  const {
    totalSubscriptions,
    activeCount,
    pausedCount,
    cancelledCount,
    trialCount,
    totalMonthlySpend,
    totalYearlySpend
  } = summary

  const stats = [
    {
      name: 'Total Subscriptions',
      value: totalSubscriptions,
      icon: CreditCard,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: null
    },
    {
      name: 'Active',
      value: activeCount,
      icon: Play,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: null
    },
    {
      name: 'Monthly Spend',
      value: `$${totalMonthlySpend.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null
    },
    {
      name: 'Yearly Spend',
      value: `$${totalYearlySpend.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null
    }
  ]

  // Add additional stats if there are paused, cancelled, or trial subscriptions
  const additionalStats = []
  
  if (trialCount > 0) {
    additionalStats.push({
      name: 'Trials',
      value: trialCount,
      icon: Crown,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      change: null
    })
  }
  
  if (pausedCount > 0) {
    additionalStats.push({
      name: 'Paused',
      value: pausedCount,
      icon: Pause,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: null
    })
  }
  
  if (cancelledCount > 0) {
    additionalStats.push({
      name: 'Cancelled',
      value: cancelledCount,
      icon: XCircle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      change: null
    })
  }

  const allStats = [...stats, ...additionalStats]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {allStats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="card p-5 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
            </div>
            
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  {stat.change && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.change.type === 'increase' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.change.type === 'increase' ? '+' : '-'}{stat.change.value}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
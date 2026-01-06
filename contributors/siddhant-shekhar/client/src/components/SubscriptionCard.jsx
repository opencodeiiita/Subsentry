import { motion } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  MoreHorizontal, 
  AlertTriangle,
  CheckCircle,
  Pause,
  XCircle,
  Crown,
  ExternalLink
} from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  active: {
    icon: CheckCircle,
    className: 'badge-success',
    label: 'Active'
  },
  paused: {
    icon: Pause,
    className: 'badge-warning',
    label: 'Paused'
  },
  cancelled: {
    icon: XCircle,
    className: 'badge-danger',
    label: 'Cancelled'
  }
}

const CATEGORY_COLORS = {
  entertainment: 'bg-purple-100 text-purple-700',
  music: 'bg-pink-100 text-pink-700',
  education: 'bg-blue-100 text-blue-700',
  productivity: 'bg-green-100 text-green-700',
  finance: 'bg-yellow-100 text-yellow-700',
  health: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700'
}

export default function SubscriptionCard({ subscription }) {
  const {
    id,
    name,
    amount,
    currency,
    billingCycle,
    category,
    renewalDate,
    status,
    isTrial,
    trialEndsAt,
    source,
    description
  } = subscription

  const StatusIcon = STATUS_CONFIG[status]?.icon || CheckCircle
  const renewalDateObj = new Date(renewalDate)
  const trialEndDateObj = trialEndsAt ? new Date(trialEndsAt) : null
  
  // Check if renewal is urgent (within 3 days)
  const isUrgentRenewal = isAfter(addDays(new Date(), 3), renewalDateObj) && 
                         isBefore(new Date(), renewalDateObj)
  
  // Check if trial is ending soon (within 2 days)
  const isTrialEndingSoon = trialEndDateObj && 
                           isAfter(addDays(new Date(), 2), trialEndDateObj) && 
                           isBefore(new Date(), trialEndDateObj)

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      weekly: 'week',
      monthly: 'month',
      yearly: 'year',
      custom: 'period'
    }
    return labels[cycle] || cycle
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card p-6 hover:shadow-lg transition-all duration-200 relative group"
    >
      {/* Urgent renewal indicator */}
      {(isUrgentRenewal || isTrialEndingSoon) && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-warning-500 text-white rounded-full p-1 animate-pulse-soft">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            {isTrial && (
              <Crown className="h-4 w-4 text-warning-500" title="Trial subscription" />
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx('badge', STATUS_CONFIG[status]?.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {STATUS_CONFIG[status]?.label}
            </span>
            
            <span className={clsx('badge', CATEGORY_COLORS[category])}>
              {category}
            </span>
            
            {source !== 'manual' && (
              <span className="badge-gray">
                {source}
              </span>
            )}
          </div>
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {formatAmount(amount, currency)}
          </span>
          <span className="text-sm text-gray-500">
            /{getBillingCycleLabel(billingCycle)}
          </span>
        </div>
      </div>

      {/* Renewal Info */}
      <div className="space-y-3">
        {isTrial && trialEndDateObj ? (
          <div className={clsx(
            'flex items-center gap-2 p-2 rounded-lg',
            isTrialEndingSoon ? 'bg-warning-50 text-warning-700' : 'bg-blue-50 text-blue-700'
          )}>
            <Crown className="h-4 w-4" />
            <div className="text-sm">
              <span className="font-medium">Trial ends:</span>{' '}
              {format(trialEndDateObj, 'MMM d, yyyy')}
            </div>
          </div>
        ) : (
          <div className={clsx(
            'flex items-center gap-2 p-2 rounded-lg',
            isUrgentRenewal ? 'bg-warning-50 text-warning-700' : 'bg-gray-50 text-gray-700'
          )}>
            <Calendar className="h-4 w-4" />
            <div className="text-sm">
              <span className="font-medium">Next renewal:</span>{' '}
              {format(renewalDateObj, 'MMM d, yyyy')}
            </div>
          </div>
        )}

        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          View Details
        </button>
        
        <div className="flex items-center gap-2">
          {status === 'active' ? (
            <button className="text-sm text-gray-600 hover:text-gray-700">
              Pause
            </button>
          ) : status === 'paused' ? (
            <button className="text-sm text-success-600 hover:text-success-700">
              Resume
            </button>
          ) : null}
          
          <button className="text-sm text-danger-600 hover:text-danger-700">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}
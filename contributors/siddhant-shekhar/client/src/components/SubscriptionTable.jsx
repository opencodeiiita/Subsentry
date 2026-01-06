import { motion } from 'framer-motion'
import { 
  MoreHorizontal, 
  ExternalLink,
  CheckCircle,
  Pause,
  XCircle,
  Crown,
  AlertTriangle
} from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  active: {
    icon: CheckCircle,
    className: 'text-success-600 bg-success-50',
    label: 'Active'
  },
  paused: {
    icon: Pause,
    className: 'text-warning-600 bg-warning-50',
    label: 'Paused'
  },
  cancelled: {
    icon: XCircle,
    className: 'text-danger-600 bg-danger-50',
    label: 'Cancelled'
  }
}

export default function SubscriptionTable({ subscriptions }) {
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      custom: 'Custom'
    }
    return labels[cycle] || cycle
  }

  const isUrgentRenewal = (renewalDate) => {
    const renewalDateObj = new Date(renewalDate)
    return isAfter(addDays(new Date(), 3), renewalDateObj) && 
           isBefore(new Date(), renewalDateObj)
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Renewal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription, index) => {
              const StatusIcon = STATUS_CONFIG[subscription.status]?.icon || CheckCircle
              const isUrgent = isUrgentRenewal(subscription.renewalDate)
              
              return (
                <motion.tr
                  key={subscription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Subscription Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.name}
                          </div>
                          {subscription.isTrial && (
                            <Crown className="h-4 w-4 text-warning-500" title="Trial subscription" />
                          )}
                        </div>
                        {subscription.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {subscription.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(subscription.amount, subscription.currency)}
                    </div>
                  </td>

                  {/* Billing Cycle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getBillingCycleLabel(subscription.billingCycle)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      STATUS_CONFIG[subscription.status]?.className
                    )}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {STATUS_CONFIG[subscription.status]?.label}
                    </span>
                  </td>

                  {/* Next Renewal */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={clsx(
                      'flex items-center gap-1 text-sm',
                      isUrgent ? 'text-warning-600' : 'text-gray-900'
                    )}>
                      {isUrgent && <AlertTriangle className="h-4 w-4" />}
                      {format(new Date(subscription.renewalDate), 'MMM d, yyyy')}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {subscription.category}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-primary-600 hover:text-primary-900 p-1">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
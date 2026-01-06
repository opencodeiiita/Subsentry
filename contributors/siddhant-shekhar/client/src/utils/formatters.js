import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  return format(new Date(date), formatString)
}

export const formatRelativeDate = (date) => {
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) {
    return 'Today'
  }
  
  if (isTomorrow(dateObj)) {
    return 'Tomorrow'
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const getBillingCycleLabel = (cycle) => {
  const labels = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    custom: 'Custom'
  }
  return labels[cycle] || cycle
}

export const getCategoryColor = (category) => {
  const colors = {
    entertainment: 'bg-purple-100 text-purple-700 border-purple-200',
    music: 'bg-pink-100 text-pink-700 border-pink-200',
    education: 'bg-blue-100 text-blue-700 border-blue-200',
    productivity: 'bg-green-100 text-green-700 border-green-200',
    finance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    health: 'bg-red-100 text-red-700 border-red-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200'
  }
  return colors[category] || colors.other
}

export const getStatusConfig = (status) => {
  const configs = {
    active: {
      variant: 'success',
      label: 'Active'
    },
    paused: {
      variant: 'warning',
      label: 'Paused'
    },
    cancelled: {
      variant: 'danger',
      label: 'Cancelled'
    }
  }
  return configs[status] || configs.active
}
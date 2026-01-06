import { motion } from 'framer-motion'
import { CreditCard, Search, Plus, Filter } from 'lucide-react'

export default function EmptyState({ hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No subscriptions found
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          We couldn't find any subscriptions matching your current filters. 
          Try adjusting your search criteria or clearing the filters.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClearFilters}
            className="btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
          
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="mx-auto h-24 w-24 rounded-full bg-primary-50 flex items-center justify-center mb-6">
        <CreditCard className="h-12 w-12 text-primary-500" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No subscriptions yet
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Get started by adding your first subscription. Track renewals, 
        manage costs, and never miss a payment again.
      </p>
      
      <button className="btn-primary">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Subscription
      </button>
      
      {/* Feature highlights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Track All Subscriptions
          </h4>
          <p className="text-xs text-gray-500">
            Keep all your recurring payments in one place
          </p>
        </div>
        
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Smart Reminders
          </h4>
          <p className="text-xs text-gray-500">
            Get notified before renewals and trial endings
          </p>
        </div>
        
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <Plus className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Cost Analytics
          </h4>
          <p className="text-xs text-gray-500">
            Understand your spending patterns and save money
          </p>
        </div>
      </div>
    </motion.div>
  )
}
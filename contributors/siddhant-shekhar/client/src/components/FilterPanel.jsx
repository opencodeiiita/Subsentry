import { X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' }
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'music', label: 'Music' },
  { value: 'education', label: 'Education' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' }
]

const TRIAL_OPTIONS = [
  { value: '', label: 'All Subscriptions' },
  { value: 'true', label: 'Trial Only' },
  { value: 'false', label: 'Paid Only' }
]

export default function FilterPanel({ filters, onFilterChange, onClear, hasActiveFilters }) {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value })
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input"
          >
            {CATEGORY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Trial Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Type
          </label>
          <select
            value={filters.isTrial}
            onChange={(e) => handleFilterChange('isTrial', e.target.value)}
            className="input"
          >
            {TRIAL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Renewal Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renewal From
          </label>
          <input
            type="date"
            value={filters.renewalFrom}
            onChange={(e) => handleFilterChange('renewalFrom', e.target.value)}
            className="input"
          />
        </div>

        {/* Renewal Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renewal To
          </label>
          <input
            type="date"
            value={filters.renewalTo}
            onChange={(e) => handleFilterChange('renewalTo', e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                Status: {STATUS_OPTIONS.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                Category: {CATEGORY_OPTIONS.find(opt => opt.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.isTrial && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                Type: {TRIAL_OPTIONS.find(opt => opt.value === filters.isTrial)?.label}
                <button
                  onClick={() => handleFilterChange('isTrial', '')}
                  className="hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.renewalFrom && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                From: {filters.renewalFrom}
                <button
                  onClick={() => handleFilterChange('renewalFrom', '')}
                  className="hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.renewalTo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                To: {filters.renewalTo}
                <button
                  onClick={() => handleFilterChange('renewalTo', '')}
                  className="hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
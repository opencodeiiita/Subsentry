import { useState, useEffect, useCallback } from 'react'

export function useSubscriptions(params = {}) {
  const [subscriptions, setSubscriptions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const queryParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value)
        }
      })

      // Use test endpoint for demo purposes
      const response = await fetch(`/api/test/subscriptions?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.data.subscriptions || [])
        setSummary(data.data.summary || null)
        setPagination(data.meta?.pagination || null)
      } else {
        throw new Error(data.message || 'Failed to fetch subscriptions')
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      setError(err.message)
      
      // Fallback to mock data for demo
      setSubscriptions(getMockSubscriptions())
      setSummary(getMockSummary())
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const refetch = useCallback(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return {
    subscriptions,
    summary,
    loading,
    error,
    pagination,
    refetch
  }
}

// Mock data for demo purposes
function getMockSubscriptions() {
  return [
    {
      id: '1',
      name: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'entertainment',
      renewalDate: '2024-02-15',
      status: 'active',
      isTrial: false,
      source: 'manual',
      description: 'Premium streaming service with 4K content',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Spotify Premium',
      amount: 9.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'music',
      renewalDate: '2024-02-10',
      status: 'active',
      isTrial: false,
      source: 'manual',
      description: 'Ad-free music streaming',
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Adobe Creative Cloud',
      amount: 52.99,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'productivity',
      renewalDate: '2024-02-20',
      status: 'active',
      isTrial: false,
      source: 'manual',
      description: 'Complete creative suite for designers',
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '4',
      name: 'GitHub Pro',
      amount: 4.00,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'productivity',
      renewalDate: '2024-02-08',
      status: 'active',
      isTrial: true,
      trialEndsAt: '2024-02-08',
      source: 'manual',
      description: 'Advanced GitHub features for developers',
      createdAt: '2024-01-08T00:00:00Z'
    },
    {
      id: '5',
      name: 'Notion Pro',
      amount: 8.00,
      currency: 'USD',
      billingCycle: 'monthly',
      category: 'productivity',
      renewalDate: '2024-02-25',
      status: 'paused',
      isTrial: false,
      source: 'manual',
      description: 'All-in-one workspace for notes and projects',
      createdAt: '2024-01-25T00:00:00Z'
    },
    {
      id: '6',
      name: 'Disney+',
      amount: 79.99,
      currency: 'USD',
      billingCycle: 'yearly',
      category: 'entertainment',
      renewalDate: '2024-12-15',
      status: 'active',
      isTrial: false,
      source: 'manual',
      description: 'Family-friendly streaming content',
      createdAt: '2023-12-15T00:00:00Z'
    }
  ]
}

function getMockSummary() {
  return {
    totalSubscriptions: 6,
    activeCount: 4,
    pausedCount: 1,
    cancelledCount: 0,
    trialCount: 1,
    totalMonthlySpend: 90.97,
    totalYearlySpend: 1091.64
  }
}
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardLayout from '../components/DashboardLayout';
import {
  SubscriptionCard,
  FilterBar,
  SortDropdown,
  ViewToggle,
  EmptyState,
  QuickStats,
  FilterStatus,
  FilterBillingCycle,
  FilterCategory,
  SortField,
  SortOrder,
} from '../components/subscriptions';
import UpdateSubscriptionModal from '../components/subscriptions/UpdateSubscriptionModal';
import RemoveSubscriptionDialog from '../components/subscriptions/RemoveSubscriptionDialog';
import { Subscription, getSubscriptions, updateSubscription, deleteSubscription } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/ui/aceternity';

export default function SubscriptionsPage() {
  const { getToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState<FilterBillingCycle>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  // Sort state
  const [sortField, setSortField] = useState<SortField>('renewalDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Edit/Delete modal state
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

  // Fetch subscriptions from real API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) {
          setError('Authentication required');
          return;
        }
        const data = await getSubscriptions(token);
        setSubscriptions(data.subscriptions || []);
      } catch (err) {
        setError('Failed to load subscriptions. Make sure the server is running.');
        toast.error('Failed to load subscriptions', {
          description: 'Make sure the server is running.',
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [getToken]);

  // Calculate active filters count
  const activeFiltersCount = [
    statusFilter !== 'all',
    billingCycleFilter !== 'all',
    categoryFilter !== 'all',
  ].filter(Boolean).length;

  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Apply filters
    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (billingCycleFilter !== 'all') {
      result = result.filter((s) => s.billingCycle === billingCycleFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((s) => s.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'renewalDate':
          comparison = new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [subscriptions, statusFilter, billingCycleFilter, categoryFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setStatusFilter('all');
    setBillingCycleFilter('all');
    setCategoryFilter('all');
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      const data = await getSubscriptions(token);
      setSubscriptions(data.subscriptions || []);
      toast.success('Refreshed successfully');
    } catch (err) {
      setError('Failed to refresh subscriptions');
      toast.error('Failed to refresh', {
        description: 'Could not refresh subscriptions.',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Handler to change sort field
  const handleSortChange = (field: SortField) => {
    setSortField(field);
  };

  // FIXED: Handler to toggle sort order
  const handleOrderToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Handle edit subscription - ADAPTED for UpdateSubscriptionModal
  const handleEditSubscription = async (id: string, data: Partial<Subscription>) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Editing subscription:', id, data); // Debug log
      const result = await updateSubscription(token, id, data);

      // Update local state - USE _id NOT id
      setSubscriptions((prev) =>
        prev.map((sub) => (sub._id === id ? result.subscription : sub))
      );

      toast.success('Subscription updated', {
        description: `${result.subscription.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Re-throw so modal can handle it
    }
  };

  // Handle delete subscription - FIX THE ID FIELD
  const handleDeleteSubscription = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get subscription name before deleting
      const subscription = subscriptions.find((s) => s._id === id);
      const subName = subscription?.name || 'Subscription';

      await deleteSubscription(token, id);

      // Remove from local state - USE _id NOT id
      setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));

      toast.success('Subscription deleted', {
        description: `${subName} has been permanently removed.`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return (
    <DashboardLayout 
      title="My Subscriptions"
      subtitle={`${subscriptions.length} ${subscriptions.length === 1 ? 'subscription' : 'subscriptions'} tracked`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            </Button>
            <Link href="/subscriptions/add">
              <ShimmerButton>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </ShimmerButton>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        {!isLoading && subscriptions.length > 0 && (
          <QuickStats subscriptions={subscriptions} />
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <FilterBar
            statusFilter={statusFilter}
            billingCycleFilter={billingCycleFilter}
            categoryFilter={categoryFilter}
            onStatusChange={setStatusFilter}
            onBillingCycleChange={setBillingCycleFilter}
            onCategoryChange={setCategoryFilter}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
          />
          <div className="flex gap-2">
            {/* FIXED: Added both onSortChange AND onOrderToggle */}
            <SortDropdown
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onOrderToggle={handleOrderToggle}
            />
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="ml-3 text-gray-400">Loading your subscriptions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedSubscriptions.length === 0 ? (
          subscriptions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No subscriptions match your filters</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-gray-400">
              Showing {filteredAndSortedSubscriptions.length} of {subscriptions.length} subscriptions
            </p>

            {/* Subscription Grid/List */}
            <motion.div
              layout
              className={cn(
                view === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedSubscriptions.map((subscription, index) => (
                  <SubscriptionCard
                    key={subscription._id}
                    subscription={subscription}
                    view={view}
                    index={index}
                    onEdit={() => setEditingSubscription(subscription)}
                    onDelete={() => setDeletingSubscription(subscription)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Edit Modal - Using RENAMED UpdateSubscriptionModal */}
      <UpdateSubscriptionModal
        subscriptionData={editingSubscription}
        visible={!!editingSubscription}
        onDismiss={() => setEditingSubscription(null)}
        onUpdate={handleEditSubscription}
      />

      {/* Delete Dialog - Using RENAMED RemoveSubscriptionDialog */}
      <RemoveSubscriptionDialog
        subscriptionData={deletingSubscription}
        open={!!deletingSubscription}
        onOpenChange={(open) => {
          if (!open) setDeletingSubscription(null);
        }}
        onRemove={handleDeleteSubscription}
      />
    </DashboardLayout>
  );
}

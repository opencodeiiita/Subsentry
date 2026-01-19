'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
  Plus,
} from 'lucide-react';
import { Subscription } from '@/lib/api';
import { 
  cn, 
  formatCurrency, 
  getDaysUntilRenewal, 
  isUrgentRenewal,
  getCategoryColor,
  getStatusColor,
  formatDate,
} from '@/lib/utils';
import { getServiceIcon, getServiceColors } from '@/lib/service-icons';

// Mock data for demonstration
const mockSubscriptions: Subscription[] = [
  {
    _id: '1',
    userId: 'user1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'entertainment',
    renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: false,
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    userId: 'user1',
    name: 'Spotify Premium',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'music',
    renewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: false,
    source: 'gmail',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    userId: 'user1',
    name: 'Adobe Creative Cloud',
    amount: 54.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: false,
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    userId: 'user1',
    name: 'ChatGPT Plus',
    amount: 20.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    userId: 'user1',
    name: 'GitHub Copilot',
    amount: 10.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: false,
    source: 'imported',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    userId: 'user1',
    name: 'Notion',
    amount: 8.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    isTrial: false,
    source: 'manual',
    status: 'paused',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const { getToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setSubscriptions(mockSubscriptions);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  // Calculate stats
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === 'monthly') return sum + sub.amount;
    if (sub.billingCycle === 'yearly') return sum + (sub.amount / 12);
    if (sub.billingCycle === 'weekly') return sum + (sub.amount * 4.33);
    return sum + sub.amount;
  }, 0);
  const urgentRenewals = subscriptions.filter(s => 
    s.status === 'active' && isUrgentRenewal(s.renewalDate)
  );
  const trialsEnding = subscriptions.filter(s => 
    s.isTrial && s.trialEndsAt && getDaysUntilRenewal(s.trialEndsAt) <= 7
  );

  const summaryCards = [
    {
      label: 'Monthly Spend',
      value: formatCurrency(monthlyTotal),
      hint: `${formatCurrency(monthlyTotal * 12)}/year`,
      icon: DollarSign,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubscriptions.length.toString(),
      hint: `${subscriptions.length} total`,
      icon: CreditCard,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Upcoming Renewals',
      value: urgentRenewals.length.toString(),
      hint: 'Next 3 days',
      icon: AlertTriangle,
      iconBg: urgentRenewals.length > 0 ? 'bg-amber-500/20' : 'bg-gray-500/20',
      iconColor: urgentRenewals.length > 0 ? 'text-amber-400' : 'text-gray-400',
      highlight: urgentRenewals.length > 0,
    },
    {
      label: 'Trials Ending',
      value: trialsEnding.length.toString(),
      hint: 'Within 7 days',
      icon: Clock,
      iconBg: trialsEnding.length > 0 ? 'bg-purple-500/20' : 'bg-gray-500/20',
      iconColor: trialsEnding.length > 0 ? 'text-purple-400' : 'text-gray-400',
      highlight: trialsEnding.length > 0,
    },
  ];

  // Get recent subscriptions sorted by renewal date
  const recentSubscriptions = [...subscriptions]
    .filter(s => s.status === 'active')
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Overview of your subscriptions">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of your subscriptions">
      {/* Welcome Banner */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back! 👋</h2>
            <p className="text-gray-400">
              You have {urgentRenewals.length > 0 ? (
                <span className="text-amber-400 font-medium">{urgentRenewals.length} upcoming renewal{urgentRenewals.length > 1 ? 's' : ''}</span>
              ) : (
                'no urgent renewals'
              )} in the next 3 days.
            </p>
          </div>
          <Link
            href="/subscriptions"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.label} 
              className={cn(
                "p-5 rounded-xl border transition-all duration-200 hover:border-[#2a2a2a]",
                card.highlight 
                  ? "bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border-amber-500/30" 
                  : "bg-[#0f0f0f] border-[#1a1a1a]"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.iconBg)}>
                  <Icon className={cn("w-4 h-4", card.iconColor)} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className={cn("text-xs mt-1", card.highlight ? card.iconColor : "text-gray-500")}>
                {card.hint}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Subscriptions */}
        <div className="lg:col-span-2 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Upcoming Renewals</h3>
            <Link 
              href="/subscriptions" 
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No active subscriptions</p>
              <Link href="/subscriptions" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                Add your first subscription
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubscriptions.map((sub) => {
                const daysUntil = getDaysUntilRenewal(sub.renewalDate);
                const isUrgent = isUrgentRenewal(sub.renewalDate);
                const categoryColors = getCategoryColor(sub.category);
                const initials = sub.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                
                // Get service-specific icon and colors
                const serviceIcon = getServiceIcon(sub.name);
                const serviceColors = getServiceColors(sub.name);
                const iconBg = serviceColors?.bg || categoryColors.bg;
                const iconText = serviceColors?.text || categoryColors.text;

                return (
                  <div 
                    key={sub._id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-[#141414]",
                      isUrgent ? "border-amber-500/30 bg-amber-500/5" : "border-[#1a1a1a]"
                    )}
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                      iconBg,
                      iconText
                    )}>
                      {serviceIcon || initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{sub.name}</span>
                        {sub.isTrial && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
                            Trial
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{sub.category}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="font-semibold text-white">{formatCurrency(sub.amount)}</div>
                      <div className="text-xs text-gray-500">/{sub.billingCycle === 'yearly' ? 'year' : 'mo'}</div>
                    </div>
                    <div className={cn(
                      "text-right",
                      isUrgent ? "text-amber-400" : "text-gray-400"
                    )}>
                      <div className="flex items-center gap-1.5 justify-end">
                        {isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span className="text-sm font-medium">
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(sub.renewalDate)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/subscriptions/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Add Subscription</div>
                  <div className="text-xs text-gray-500">Track a new service</div>
                </div>
              </Link>
              <Link 
                href="/analytics"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-white">View Analytics</div>
                  <div className="text-xs text-gray-500">See spending trends</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Spending Insight */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Spending Insight</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your productivity tools account for <span className="text-white font-medium">
                {formatCurrency(subscriptions.filter(s => s.category === 'productivity' && s.status === 'active').reduce((sum, s) => sum + s.amount, 0))}
              </span> of your monthly spend.
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(subscriptions.filter(s => s.status === 'active').map(s => s.category))).map(category => {
                const colors = getCategoryColor(category);
                const count = subscriptions.filter(s => s.category === category && s.status === 'active').length;
                return (
                  <span 
                    key={category}
                    className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", colors.bg, colors.text)}
                  >
                    {category} ({count})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

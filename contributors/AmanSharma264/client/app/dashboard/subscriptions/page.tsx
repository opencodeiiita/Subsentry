"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
  Home,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import AddSubscriptionDrawer from "@/app/components/subscriptions/AddSubscriptionDrawer";

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBillingCycle, setFilterBillingCycle] = useState("all");
  const [sortBy, setSortBy] = useState("renewalDate");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("subscriptions");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/subscriptions");
        const json = await res.json();

        const normalized = (json.data || []).map((sub: any) => ({
          id: sub._id,
          name: sub.name,
          amount: sub.price,
          billingCycle: sub.billingCycle,
          category: sub.category,
          renewalDate: sub.renewalDate,
          trial: sub.isTrial,
          status: sub.isTrial ? "trial" : "active",
          source: "manual",
        }));

        setSubscriptions(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // 🔹 DAYS UNTIL RENEWAL
  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    return Math.ceil(
      (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // 🔹 FILTER + SORT (UNCHANGED)
  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || sub.status === filterStatus;

      const matchesBilling =
        filterBillingCycle === "all" ||
        sub.billingCycle === filterBillingCycle;

      return matchesSearch && matchesStatus && matchesBilling;
    })
    .sort((a, b) => {
      if (sortBy === "renewalDate") {
        return (
          new Date(a.renewalDate).getTime() -
          new Date(b.renewalDate).getTime()
        );
      }
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return 0;
    });

  // 🔹 STATS
  const urgentRenewals = subscriptions.filter((sub) => {
    const days = getDaysUntilRenewal(sub.renewalDate);
    return days <= 3 && days >= 0;
  }).length;

  const monthlySpending = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12);
  }, 0);

  // 🔹 CARD COMPONENT
  const SubscriptionCard = ({ subscription }: any) => {
    const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
    const isUrgent = daysUntil <= 3 && daysUntil >= 0;

    return (
      <div
        className={`bg-gray-800 rounded-xl p-6 border-2 transition-all hover:shadow-xl hover:scale-[1.02] ${
          isUrgent
            ? "border-red-500 bg-red-900/10"
            : "border-gray-700 hover:border-gray-600"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {subscription.name}
            </h3>
            <p className="text-gray-400 text-sm">{subscription.category}</p>
          </div>

          <div className="flex gap-2">
            {subscription.trial && (
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                TRIAL
              </span>
            )}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                subscription.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {subscription.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Amount</p>
            <p className="text-2xl font-bold text-white">
              ₹{subscription.amount}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Billing Cycle</p>
            <p className="text-white capitalize">{subscription.billingCycle}</p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            isUrgent
              ? "bg-red-500/20 border border-red-500"
              : "bg-gray-700"
          }`}
        >
          <Calendar
            size={18}
            className={isUrgent ? "text-red-400" : "text-gray-400"}
          />
          <div className="flex-1">
            <p className="text-xs text-gray-400">Renewal Date</p>
            <p
              className={`font-semibold ${
                isUrgent ? "text-red-400" : "text-white"
              }`}
            >
              {new Date(subscription.renewalDate).toLocaleDateString()}
            </p>
          </div>
          {isUrgent && (
            <div className="flex items-center gap-1 text-red-400 font-bold text-sm">
              <AlertCircle size={16} />
              {daysUntil} days
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Source: {subscription.source}
          </span>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Manage
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 rounded-xl p-6 text-white">
          <p>Total Subscriptions</p>
          <h2 className="text-3xl font-bold">{subscriptions.length}</h2>
        </div>
        <div className="bg-green-600 rounded-xl p-6 text-white">
          <p>Monthly Spending</p>
          <h2 className="text-3xl font-bold">
            ₹{monthlySpending.toFixed(2)}
          </h2>
        </div>
        <div className="bg-red-600 rounded-xl p-6 text-white">
          <p>Urgent Renewals</p>
          <h2 className="text-3xl font-bold">{urgentRenewals}</h2>
        </div>
      </div>

      {/* 🔹 FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
        </select>

        <select
          value={filterBillingCycle}
          onChange={(e) => setFilterBillingCycle(e.target.value)}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
        >
          <option value="all">All Billing</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
        >
          <option value="renewalDate">Sort by Renewal</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* 🔹 LIST */}
      {loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
) : filteredSubscriptions.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <CreditCard size={64} className="text-gray-600 mb-4" />
    <h3 className="text-2xl font-bold text-white mb-2">
      No subscriptions added
    </h3>
    <p className="text-gray-400 mb-6">
      {searchTerm ||
      filterStatus !== "all" ||
      filterBillingCycle !== "all"
        ? "Try adjusting your search or filters"
        : "Start by adding your first subscription"}
    </p>

    <AddSubscriptionDrawer />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {filteredSubscriptions.map((sub) => (
      <SubscriptionCard key={sub.id} subscription={sub} />
    ))}
  </div>
)}

    </div>
  );
};

export default SubscriptionDashboard;

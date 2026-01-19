"use client";

import { useState, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import { SubscriptionData } from "./subscriptions/page";
import Modal from "./components/Modal";
import SubscriptionForm from "./components/SubscriptionForm";
import EditSubscriptionForm from "./components/EditSubscriptionForm";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

export default function Dashboard() {
  const [subscriptionList, setSubscriptionList] = useState<SubscriptionData[]>(
    []
  );
  const [loadingState, setLoadingState] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionData | null>(null);
  const [deletingSubscription, setDeletingSubscription] =
    useState<SubscriptionData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoadingState(true);
      const response = await fetch("/api/subscriptions");
      const data = await response.json();
      setSubscriptionList(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoadingState(false);
    }
  };

  const calculateStats = () => {
    const activeSubscriptions = subscriptionList.filter(
      (sub) => sub.serviceStatus === "active"
    );
    const trialSubscriptions = subscriptionList.filter(
      (sub) => sub.serviceStatus === "trial"
    );
    const monthlySubscriptions = activeSubscriptions.filter(
      (sub) => sub.billingInterval === "monthly"
    );
    const monthlyTotal = monthlySubscriptions.reduce(
      (sum, sub) => sum + sub.cost,
      0
    );

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const upcomingRenewals = subscriptionList.filter((sub) => {
      const renewalDate = new Date(sub.upcomingRenewal);
      return renewalDate >= today && renewalDate <= sevenDaysFromNow;
    });

    return {
      monthlySpend: monthlyTotal,
      activeCount: activeSubscriptions.length,
      upcomingRenewalsCount: upcomingRenewals.length,
      trialCount: trialSubscriptions.length,
    };
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchSubscriptionData();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingSubscription(null);
    fetchSubscriptionData();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingSubscription(null);
  };

  const handleEdit = (subscription: SubscriptionData) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleDelete = (subscription: SubscriptionData) => {
    setDeletingSubscription(subscription);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubscription) return;

    try {
      const response = await fetch(
        `/api/subscriptions/${deletingSubscription._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      setIsDeleteDialogOpen(false);
      setDeleteSuccess(true);
      setDeletingSubscription(null);
      fetchSubscriptionData();

      // Hide success message after 2 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingSubscription(null);
  };

  const stats = calculateStats();

  return (
    <AppLayout activePage="Dashboard">
      {/* Delete Success Message */}
      {deleteSuccess && (
        <div className="mb-6 p-4 bg-[#16A34A] text-white rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Subscription deleted successfully!
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">Dashboard</h1>
          <p className="text-[#B3B3B3]">
            Welcome back! Here's an overview of your subscriptions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Subscription
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#191919] p-6 rounded-xl border border-[#2A2A2A]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FFFFFF] text-sm font-medium">
              Monthly Spend
            </span>
            <div className="w-8 h-8 bg-[#282828] rounded-lg flex items-center justify-center">
              <span className="text-[#0000FF] text-sm">💰</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-[#0000FF]">
            ${stats.monthlySpend.toFixed(2)}
          </div>
          <div className="text-xs text-[#B3B3B3] mt-1">
            From {stats.activeCount} active subscriptions
          </div>
        </div>

        <div className="bg-[#191919] p-6 rounded-xl border border-[#2A2A2A]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FFFFFF] text-sm font-medium">
              Active Subscriptions
            </span>
            <div className="w-8 h-8 bg-[#282828] rounded-lg flex items-center justify-center">
              <span className="text-[#10B981] text-sm">✓</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-[#009200]">
            {stats.activeCount}
          </div>
          <div className="text-xs text-[#B3B3B3] mt-1">All active</div>
        </div>

        <div className="bg-[#191919] p-6 rounded-xl border border-[#2A2A2A]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FFFFFF] text-sm font-medium">
              Upcoming Renewals
            </span>
            <div className="w-8 h-8 bg-[#282828] rounded-lg flex items-center justify-center">
              <span className="text-[#F59E0B] text-sm">📅</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-[#F59E0B]">
            {stats.upcomingRenewalsCount}
          </div>
          <div className="text-xs text-[#B3B3B3] mt-1">Next 7 days</div>
        </div>

        <div className="bg-[#191919] p-6 rounded-xl border border-[#2A2A2A]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FFFFFF] text-sm font-medium">
              Free Trials
            </span>
            <div className="w-8 h-8 bg-[#282828] rounded-lg flex items-center justify-center">
              <span className="text-[#737373] text-sm">⏱</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-[#FF0000]">
            {stats.trialCount}
          </div>
          <div className="text-xs text-[#B3B3B3] mt-1">Active trials</div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Subscription"
      >
        <SubscriptionForm onSuccess={handleFormSuccess} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        title="Edit Subscription"
      >
        {editingSubscription && (
          <EditSubscriptionForm
            subscription={editingSubscription}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        subscription={deletingSubscription!}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </AppLayout>
  );
}

import AddSubscriptionForm from '@/app/components/subscriptions/AddSubscriptionForm';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function AddSubscriptionPage() {
  return (
    <DashboardLayout title="Add Subscription" subtitle="Track a new recurring payment">
      <AddSubscriptionForm />
    </DashboardLayout>
  );
}

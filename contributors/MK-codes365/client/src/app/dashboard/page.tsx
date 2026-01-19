import { UserButton } from "@clerk/nextjs";
import SummaryWidgets from "@/components/SummaryWidgets";
import UpcomingRenewals from "@/components/UpcomingRenewals";

export const dynamic = "force-dynamic";

interface SubscriptionData {
  _id: string;
  name: string;
  renewalDate: string;
  price?: number;
  amount?: number;
  hasTrial?: boolean;
  isTrial?: boolean;
  billingCycle?: string;
}

async function getSubscriptions(): Promise<{ data: SubscriptionData[] }> {
  try {
    const res = await fetch("http://localhost:5000/api/subscriptions", {
      cache: "no-store", // Ensure fresh data
    });
    if (!res.ok) {
      throw new Error("Failed to fetch subscriptions");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return { data: [] }; // Fallback
  }
}

function calculateStats(subscriptions: SubscriptionData[]) {
  const stats = {
    monthlySpend: 0,
    yearlySpend: 0,
    activeSubs: 0,
    trialSubs: 0,
  };

  if (!Array.isArray(subscriptions)) return stats;

  subscriptions.forEach((sub) => {
    // Handle backend field mapping (price vs amount)
    const amount = Number(sub.price ?? sub.amount) || 0;
    const isTrial = sub.hasTrial ?? sub.isTrial ?? false;
    const cycle = (sub.billingCycle || "").toLowerCase();

    if (isTrial) {
      stats.trialSubs++;
    } else {
      stats.activeSubs++;
    }

    // Spend calculation
    if (cycle === "monthly") {
      stats.monthlySpend += amount;
      stats.yearlySpend += amount * 12;
    } else if (cycle === "yearly") {
      stats.monthlySpend += amount / 12;
      stats.yearlySpend += amount;
    } else if (cycle === "weekly") {
      stats.monthlySpend += (amount * 52) / 12;
      stats.yearlySpend += amount * 52;
    }
  });

  return stats;
}

export default async function Dashboard() {
  const response = await getSubscriptions();
  const subscriptions = response.data || []; // Adjust based on actual API response structure
  const stats = calculateStats(subscriptions);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, here&apos;s your subscription overview.
          </p>
        </div>
        <UserButton />
      </div>

      <SummaryWidgets stats={stats} />

      <div className="mb-6">
        <a
          href="/email-ingestion"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📧 Scan Emails for Subscriptions
        </a>
      </div>

      <UpcomingRenewals subscriptions={subscriptions} />

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your detailed subscription list will appear here.
        </p>
      </div>
    </div>
  );
}

import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Welcome to Protected Route! 🔒
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          If you can see this, you are successfully authenticated with Clerk.
        </p>
      </div>
    </div>
  );
}

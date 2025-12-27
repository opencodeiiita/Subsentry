'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be signed in to access the dashboard.
          </p>
          <Link href="/sign-in">
            <Button className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // This is the actual dashboard content for authenticated users
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">View your usage statistics</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">Update your profile information</p>
          </div>
        </div>
      </div>
    </div>
  );
}
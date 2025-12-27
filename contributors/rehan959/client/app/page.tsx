'use client';

import { SignIn, SignUp, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn } = useUser();
  const [showSignIn, setShowSignIn] = useState(true);

  if (isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You are already signed in. Visit the dashboard to continue.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setShowSignIn(true)}
              className={`px-4 py-2 rounded-md ${showSignIn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium`}
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignIn(false)}
              className={`px-4 py-2 rounded-md ${!showSignIn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium`}
            >
              Sign Up
            </button>
          </div>

          {showSignIn ? (
            <SignIn
              appearance={{
                elements: {
                  card: 'p-0 border-0 shadow-none',
                  headerTitle: 'text-xl font-bold text-center',
                  headerSubtitle: 'text-sm text-gray-500 text-center mb-4',
                  socialButtonsBlockButton: 'flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700',
                  formButtonPrimary: 'w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium',
                  footerActionText: 'text-sm text-gray-500',
                  footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                }
              }}
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  card: 'p-0 border-0 shadow-none',
                  headerTitle: 'text-xl font-bold text-center',
                  headerSubtitle: 'text-sm text-gray-500 text-center mb-4',
                  socialButtonsBlockButton: 'flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700',
                  formButtonPrimary: 'w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium',
                  footerActionText: 'text-sm text-gray-500',
                  footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                }
              }}
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started with our platform
          </p>
          <Link href="/dashboard">
            <Button variant="default" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

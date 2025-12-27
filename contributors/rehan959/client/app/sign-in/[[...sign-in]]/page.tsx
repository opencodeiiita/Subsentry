'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignIn 
        appearance={{
          elements: {
            card: 'p-6 rounded-lg shadow-md w-full max-w-md',
            headerTitle: 'text-2xl font-bold text-center',
            headerSubtitle: 'text-sm text-gray-500 text-center mb-6',
            socialButtonsBlockButton: 'flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700',
            formButtonPrimary: 'w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium',
            footerActionText: 'text-sm text-gray-500',
            footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
          }
        }}
      />
    </div>
  );
}
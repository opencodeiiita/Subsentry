import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center p-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
        SubSentry <span className="text-blue-600">Auth</span>
      </h1>

      <p className="max-w-md mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
        This is a demo of Next.js authentication using Clerk.
      </p>

      <div className="flex gap-4">
        {userId ? (
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

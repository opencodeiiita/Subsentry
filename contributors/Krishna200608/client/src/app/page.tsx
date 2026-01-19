import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center text-center max-w-xl">
        <h1 className="text-4xl font-bold">SubSentry</h1>

        <p className="text-lg text-gray-500">
          Secure subscription management with industry-grade authentication.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <SignedOut>
            <SignInButton>
              <button className="rounded-full bg-black text-white px-6 py-3 hover:bg-gray-800 transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="rounded-full border px-6 py-3 hover:bg-gray-100 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-full bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}

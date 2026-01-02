import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center px-6 bg-zinc-950">
      <main className="flex flex-col items-center gap-6 text-center max-w-xl">
        <h1 className="text-4xl font-bold">SubSentry</h1>

        <p className="text-zinc-400">
          Secure subscription management with industry-grade authentication.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <SignedOut>
            <SignInButton>
              <button className="rounded-md bg-zinc-100 text-zinc-900 px-6 py-3 hover:bg-zinc-200 transition">
                Sign In
              </button>
            </SignInButton>

            <Link
              href="/sign-up"
              className="rounded-md border border-zinc-700 px-6 py-3 hover:bg-zinc-800 transition"
            >
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-md bg-zinc-100 text-zinc-900 px-6 py-3 hover:bg-zinc-200 transition"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}

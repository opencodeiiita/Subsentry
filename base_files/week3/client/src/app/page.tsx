'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

const INTRO_STORAGE_KEY = 'subsentry_intro_seen';

export default function Home() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(INTRO_STORAGE_KEY);
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  const finishIntro = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(INTRO_STORAGE_KEY, '1');
    }
    setIsExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      router.push('/sign-up');
    }, 300);
  }, [router]);

  const handleSkip = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  return (
    <>
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <video
            className="h-full w-full object-cover"
            src="/fintech-intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finishIntro}
            onError={finishIntro}
          />
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-6 right-6 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-white active:scale-95"
          >
            Skip
          </button>
        </div>
      )}

      {!showIntro && (
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
      )}
    </>
  );
}

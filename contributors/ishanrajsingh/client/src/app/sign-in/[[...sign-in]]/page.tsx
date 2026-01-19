'use client';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <SignIn />
    </div>
  );
}

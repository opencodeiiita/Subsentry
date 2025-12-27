import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <SignedOut>
        <h1>Welcome to SubSentry</h1>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <h1>You are signed in</h1>

        <UserButton />

        <Link href={"/dashboard"}   className="px-4 py-2 rounded-md text-white bg-black hover:bg-gray-800">Click here to view your dashboard</Link>
      </SignedIn>
    </main>
  );
}

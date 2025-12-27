import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="text-center space-y-3">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-sm font-semibold">
              S
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Subsentry</h1>
            <p className="text-sm text-muted-foreground">
              Welcome — log in to your account or create a new one.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Sign up
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our terms.
          </p>
        </div>
      </div>
    </main>
  );
}

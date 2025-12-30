import { SignOutButton } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <>
    <SignOutButton/>
    <h1>Protected Dashboard</h1>
    </>
  );
}

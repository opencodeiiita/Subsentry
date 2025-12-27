import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard</h1>
      <p>You are logged in 🎉</p>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

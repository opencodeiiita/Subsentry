import { UserButton } from "@clerk/nextjs";

export default function Topbar() {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 px-8 flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-300">
        Dashboard
      </span>

      <UserButton afterSignOutUrl="/" />
    </header>
  );
}

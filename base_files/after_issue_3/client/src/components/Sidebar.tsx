import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Subscriptions", href: "#" },
  { label: "Analytics", href: "#" },
  { label: "Settings", href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="px-8 py-6 text-lg font-semibold text-zinc-100">
        SubSentry
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-md px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

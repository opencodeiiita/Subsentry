import Navbar from "./components/Navbar.tsx"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  )
}

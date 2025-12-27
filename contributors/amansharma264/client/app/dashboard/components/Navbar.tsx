import Link from "next/link";

export default function Navbar(){
    return(
        <nav className="border-b border-gray-800 bg-[#0B0F19] text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-500">SubSentry</h1>
                <div className="flex gap-6 text-sm text-gray-300">
                    <Link href="/dashboard" className="hover:text-white">Dashboard
                    </Link>
                    <Link href="#" className="hover:text-white">
                    Subscriptions
                    </Link>
                    <Link href="#" className="hover:text-white">
                    Settings
                    </Link>
                </div>
            </div>
        </nav>
    )
}
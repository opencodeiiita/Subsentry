export default function DashboardPage(){
    return(
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold"></h1>
            <p className="mt-2 text-grey-400">
                Welcome to Subsentry. Track and manage your subscription
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Monthly Spend</p>
                    <h2 className="text-2xl font-semibold mt-2">₹1,249</h2>
                </div>
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Yearly Spend</p>
                    <h2 className="text-2xl font-semibold mt-2">₹12,480</h2>
                </div>
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Active Subscriptions</p>
                    <h2 className="text-2xl font-semibold mt-2">8</h2>
                </div>
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400">Upcoming Renewals</p>
                    <h2 className="text-2xl font-semibold mt-2">3</h2>
                </div>
            </div>
        </div>
    )
}
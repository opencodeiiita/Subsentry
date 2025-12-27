interface StatsCardProps{
    title: string,
    value: string
}

export default function StatsCard({title, value}: StatsCardProps){
    return(
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400">{title}</p>
            <h2 className="text-2xl font-semibold mt-2">{value}</h2>
        </div>
    )
}
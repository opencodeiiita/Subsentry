import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary-600"
        />
        <p className="mt-4 text-sm text-gray-500">Loading subscriptions...</p>
      </div>
    </div>
  )
}
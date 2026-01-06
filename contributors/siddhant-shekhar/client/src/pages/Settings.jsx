import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Download,
  Trash2,
  Save
} from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences and subscription settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a
              href="#profile"
              className="bg-primary-50 text-primary-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <User className="text-primary-500 mr-3 h-5 w-5" />
              Profile
            </a>
            <a
              href="#notifications"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <Bell className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
              Notifications
            </a>
            <a
              href="#billing"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <CreditCard className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
              Billing
            </a>
            <a
              href="#security"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <Shield className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
              Security
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
            id="profile"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Demo"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="demo@subsentry.com"
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select className="input">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
            id="notifications"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Renewal Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified before your subscriptions renew
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Trial Endings
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get alerts when free trials are about to end
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Monthly Summary
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive a monthly spending summary
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Data Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Export Data
                  </h4>
                  <p className="text-sm text-gray-500">
                    Download all your subscription data as CSV
                  </p>
                </div>
                <button className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-danger-200 rounded-lg bg-danger-50">
                <div>
                  <h4 className="text-sm font-medium text-danger-900">
                    Delete Account
                  </h4>
                  <p className="text-sm text-danger-700">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="bg-danger-600 hover:bg-danger-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
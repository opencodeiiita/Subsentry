import { Fragment, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  X, 
  Home, 
  CreditCard, 
  Settings, 
  PlusCircle,
  BarChart3,
  Calendar
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ open, setOpen }) {
  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, setOpen])

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-900/80 transition-opacity"
            onClick={() => setOpen(false)}
          />
          
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl transition-transform">
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  SubSentry
                </span>
              </div>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-1 flex-col px-6 py-6">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            clsx(
                              isActive
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                            )
                          }
                          onClick={() => setOpen(false)}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                
                <li className="mt-auto">
                  <button className="btn-primary w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Subscription
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                SubSentry
              </span>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                          )
                        }
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              
              <li className="mt-auto">
                <button className="btn-primary w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Subscription
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
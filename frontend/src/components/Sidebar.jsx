import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { useThemeStore } from '../store/themeStore'
import { Menu, X, LogOut, UtensilsCrossed, BarChart3, FileText, Home, Calendar, Moon, Sun, Star, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { addToast } = useToastStore()
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'

  const menuItems = isAdmin
    ? [
        { label: 'Dashboard', icon: BarChart3, path: '/admin' },
        { label: 'Reports', icon: FileText, path: '/reports' },
        { label: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
      ]
    : [
        { label: 'Dashboard', icon: Home, path: '/dashboard' },
        { label: 'Daily Menu', icon: UtensilsCrossed, path: '/menu/daily' },
        { label: 'Weekly Menu', icon: Calendar, path: '/menu/weekly' },
        { label: 'Ratings', icon: Star, path: '/ratings' },
        { label: 'Feedback', icon: FileText, path: '/feedback' },
      ]

  const handleLogout = async () => {
    logout()
    addToast('Logged out successfully', 'success')
    navigate('/auth')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 hover:bg-light-300 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative top-0 left-0 h-screen w-72 bg-gradient-to-b from-light-100 to-light-200 dark:from-dark-700 dark:to-dark-800 text-dark-900 dark:text-dark-100 z-30 transform transition-all duration-300 flex flex-col border-r border-light-200 dark:border-dark-600 shadow-soft dark:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-light-200 dark:border-dark-600">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 rounded-xl shadow-soft">
                <UtensilsCrossed className="w-5 h-5 text-white dark:text-dark-100" />
              </div>
              <span className="text-dark-900 dark:text-dark-50 font-bold">Mess</span>
            </h1>
          </div>
          <p className="text-sm font-semibold text-dark-700 dark:text-dark-300">{user?.name || 'User'}</p>
          <p className="text-xs text-dark-600 dark:text-dark-400 capitalize mt-1">{user?.role} Student</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 font-semibold text-sm',
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 text-white dark:text-dark-100 shadow-soft dark:shadow-glow-md'
                    : 'text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-light-200 dark:hover:bg-dark-600'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-white dark:bg-primary-200 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle & Logout */}
        <div className="p-4 space-y-2 border-t border-light-200 dark:border-dark-600">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full p-3 text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-light-200 dark:hover:bg-dark-600 rounded-xl transition-all duration-300 font-medium text-sm"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-dark-700 dark:text-dark-300 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-light-200 dark:hover:bg-dark-600 rounded-xl transition-all duration-300 font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar

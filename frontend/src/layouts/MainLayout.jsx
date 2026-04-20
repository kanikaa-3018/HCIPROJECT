import Sidebar from '../components/Sidebar'
import { useThemeStore } from '../store/themeStore'
import { useEffect } from 'react'

function MainLayout({ children }) {
  const { theme } = useThemeStore()
  
  useEffect(() => {
    // Ensure theme is applied
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  return (
    <div className="flex min-h-screen md:h-screen md:overflow-hidden bg-light-50 dark:bg-dark-800 transition-colors duration-300">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 md:h-screen md:p-8 overflow-y-auto bg-gradient-to-br from-light-50 via-light-100 to-light-200 dark:from-dark-800 dark:via-dark-700 dark:to-dark-800 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}

export default MainLayout

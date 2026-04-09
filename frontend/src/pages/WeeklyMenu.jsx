import { useEffect, useState } from 'react'
import { Calendar, Flame } from 'lucide-react'
import Card from '../components/Card'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import { menuAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function WeeklyMenu() {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const { addToast } = useToastStore()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const data = await menuAPI.getWeeklyMenu()
        setMenu(data)
      } catch (error) {
        addToast('Failed to load weekly menu', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [addToast])

  if (loading) {
    return <SkeletonLoader count={7} height="h-24" />
  }

  if (!menu || menu.length === 0) {
    return <EmptyState title="Weekly Menu Not Available" description="Weekly menu is not available yet." />
  }

  const today = new Date()
  const dayIndex = today.getDay()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Create a map of menu items by day
  const menuByDay = {}
  menu.forEach((day) => {
    menuByDay[day.day] = day
  })

  // Ensure all days of the week are displayed
  const allDays = daysOfWeek.map((dayName) => menuByDay[dayName] || {
    day: dayName,
    breakfast: 'Not available',
    lunch: 'Not available',
    hiTea: 'Not available',
    dinner: 'Not available',
  })

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:via-primary-500 dark:to-primary-400 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Weekly Menu</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium\">Plan your meals for the week ahead</p>
          </div>
          <Flame className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Weekly Menu Grid - All 7 Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-slideUp">
        {allDays.map((day, index) => {
          const isToday = daysOfWeek[dayIndex] === day.day
          
          return (
            <Card
              key={day.day}
              className={`p-6 transition-all duration-300 ${
                isToday
                  ? 'bg-light-100 dark:bg-gradient-to-br dark:from-primary-600/20 dark:to-primary-700/20 border-primary-300 dark:border-primary-700 shadow-soft dark:shadow-glow-md'
                  : 'border-light-200 dark:border-dark-600'
              }`}
            >
              {/* Day header */}
              <div className="mb-5 pb-4 border-b-2 border-light-200 dark:border-dark-600">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-dark-900 dark:text-dark-50'}`}>
                      {day.day}
                    </h3>
                    {isToday && (
                      <span className="inline-block text-xs font-bold text-white dark:text-dark-100 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600 px-3 py-1 rounded-full mt-2">
                        Today
                      </span>
                    )}
                  </div>
                  <Calendar className={`w-5 h-5 ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-dark-400 dark:text-dark-500'}`} />
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-1">Breakfast</p>
                  <p className="text-dark-900 dark:text-dark-100 font-medium text-sm">{day.breakfast}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-1">Lunch</p>
                  <p className="text-dark-900 dark:text-dark-100 font-medium text-sm">{day.lunch}</p>
                </div>
                {day.hiTea && (
                  <div>
                    <p className="text-xs font-bold text-secondary-700 dark:text-secondary-400 uppercase tracking-wider mb-1">Hi-Tea</p>
                    <p className="text-dark-900 dark:text-dark-100 font-medium text-sm">{day.hiTea}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-1">Dinner</p>
                  <p className="text-dark-900 dark:text-dark-100 font-medium text-sm">{day.dinner}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-light-100 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700 animate-slideUp">
        <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-700 dark:text-primary-400" /> Plan Your Week
        </h3>
        <p className="text-sm text-dark-600 dark:text-dark-300">
          View upcoming meals and plan your weekly intake. You can rate meals from the Daily Menu page and provide feedback anytime to help improve meal quality!
        </p>
      </Card>
    </div>
  )
}

export default WeeklyMenu

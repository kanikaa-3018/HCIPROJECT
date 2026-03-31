import { useEffect, useState } from 'react'
import { Clock, Utensils } from 'lucide-react'
import Card from '../components/Card'
import MealCard from '../components/MealCard'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import { menuAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function DailyMenu() {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const { addToast } = useToastStore()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const data = await menuAPI.getDailyMenu()
        setMenu(data)
      } catch (error) {
        addToast('Failed to load menu', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [addToast])

  if (loading) {
    return <SkeletonLoader count={5} height="h-32" />
  }

  if (!menu) {
    return <EmptyState title="Menu Not Available" description="Today's menu is not available yet. Please check back later." />
  }

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const meals = [menu.today.breakfast, menu.today.lunch, menu.today.hiTea, menu.today.dinner]

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-400 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Today's Menu</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium">{todayDate}</p>
          </div>
          <Utensils className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Meals */}
      {meals.map((mealGroup, index) => (
        <div key={mealGroup.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
          {/* Meal section header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-600/20 border border-primary-300 dark:border-primary-700">
                <Clock className="w-6 h-6 text-primary-700 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">{mealGroup.name}</h2>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-700 px-3 py-1 rounded-full\">
                {mealGroup.time}
              </span>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealGroup.items.map((meal) => (
                <MealCard key={meal.id} meal={meal} mealType={mealGroup.name.toLowerCase()} />
              ))}
            </div>
          </div>

          {/* Divider */}
          {index !== meals.length - 1 && (
            <div className="my-8 border-t border-light-200 dark:border-dark-600" />
          )}
        </div>
      ))}

      {/* Info Card */}
      <Card className="p-6 bg-light-100 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700 animate-slideUp">
        <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-2 flex items-center gap-2">
          <span>ℹ</span> How Rating Works
        </h3>
        <p className="text-sm text-dark-600 dark:text-dark-300">
          Your ratings help us understand what meals students enjoy most. Each user can rate a meal once. The average rating is calculated from all student ratings. Higher-rated meals are featured in our recommendations!
        </p>
      </Card>
    </div>
  )
}

export default DailyMenu

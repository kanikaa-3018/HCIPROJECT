import { useEffect, useState } from 'react'
import { Clock, Utensils, TrendingUp, AlertCircle, Leaf } from 'lucide-react'
import Card from '../components/Card'
import MealCard from '../components/MealCard'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import { menuAPI, ratingAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function DailyMenu() {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const [averageRatings, setAverageRatings] = useState([])
  const { addToast } = useToastStore()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const [menuData, ratingsData] = await Promise.all([
          menuAPI.getDailyMenu(),
          ratingAPI.getAverageRatings(),
        ])
        setMenu(menuData)
        setAverageRatings(ratingsData)
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

  // Find today's best rated meal
  const bestRatedMeal = averageRatings[0]

  // Count veg meals
  const allMealsFlat = meals.flatMap(m => m.items || [])
  const vegMealCount = allMealsFlat.filter(m => m.type === 'veg').length
  const totalMealCount = allMealsFlat.length

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp">
        <Card className="p-4 border-primary-300 dark:border-primary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-200 dark:bg-primary-600/20 rounded-lg">
              <Utensils className="w-5 h-5 text-primary-700 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">{totalMealCount}</p>
              <p className="text-xs text-dark-600 dark:text-dark-400 font-semibold">Total Dishes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-secondary-300 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-200 dark:bg-secondary-600/20 rounded-lg">
              <Leaf className="w-5 h-5 text-secondary-700 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-400">{vegMealCount}</p>
              <p className="text-xs text-dark-600 dark:text-dark-400 font-semibold">Veg Options</p>
            </div>
          </div>
        </Card>

        {bestRatedMeal && (
          <Card className="p-4 border-accent-300 dark:border-accent-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-200 dark:bg-accent-600/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent-700 dark:text-accent-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-700 dark:text-accent-400">
                  {bestRatedMeal.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-dark-600 dark:text-dark-400 font-semibold">Best Rated</p>
              </div>
            </div>
          </Card>
        )}
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
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">{mealGroup.name}</h2>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mt-1">
                  Serving Time: {mealGroup.time}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-700 px-3 py-1 rounded-full">
                {mealGroup.items?.length || 0} {mealGroup.items?.length === 1 ? 'dish' : 'dishes'}
              </span>
            </div>

            {/* Meals Grid */}
            {mealGroup.items && mealGroup.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealGroup.items.map((meal) => (
                  <MealCard key={meal.id} meal={meal} mealType={mealGroup.name.toLowerCase()} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-light-100 dark:bg-dark-700">
                <AlertCircle className="w-8 h-8 text-dark-400 dark:text-dark-600 mx-auto mb-2" />
                <p className="text-dark-600 dark:text-dark-400">No dishes available for this meal</p>
              </Card>
            )}
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
          <span>💡</span> How Rating Works
        </h3>
        <p className="text-sm text-dark-600 dark:text-dark-300">
          Your ratings help us understand what meals students enjoy most. Each user can rate a meal once. The average rating is calculated from all student ratings. Higher-rated meals are featured in our recommendations! Visit the <strong>Ratings</strong> page to see your full rating history.
        </p>
      </Card>
    </div>
  )
}

export default DailyMenu

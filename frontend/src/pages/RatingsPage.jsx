import { useEffect, useState } from 'react'
import { Star, TrendingUp, Award, Calendar } from 'lucide-react'
import Card from '../components/Card'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import { ratingAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import StarRating from '../components/StarRating'

function RatingsPage() {
  const [loading, setLoading] = useState(true)
  const [userRatings, setUserRatings] = useState([])
  const [averageRatings, setAverageRatings] = useState([])
  const { addToast } = useToastStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [userRatingsData, averageRatingsData] = await Promise.all([
        ratingAPI.getUserRatings(),
        ratingAPI.getAverageRatings(),
      ])
      setUserRatings(userRatingsData)
      setAverageRatings(averageRatingsData)
    } catch (error) {
      addToast('Failed to load ratings', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SkeletonLoader count={5} height="h-24" />
  }

  // Calculate user's average
  const userAverage = userRatings.length > 0
    ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(2)
    : 0

  // Get top rated meals
  const topRatedMeals = averageRatings.slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-400 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Ratings</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium">Track your dining preferences and meal ratings</p>
          </div>
          <Star className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp">
        <Card className="p-6 text-center bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-600/20 dark:to-primary-700/20 border-primary-300 dark:border-primary-700">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-primary-200 dark:bg-primary-600/30 rounded-xl">
              <Star className="w-6 h-6 text-primary-700 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-primary-700 dark:text-primary-400 mb-1">{userRatings.length}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 font-semibold">Meals Rated</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-secondary-100 to-secondary-50 dark:from-secondary-600/20 dark:to-secondary-700/20 border-secondary-300 dark:border-secondary-700">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-secondary-200 dark:bg-secondary-600/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-secondary-700 dark:text-secondary-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-secondary-700 dark:text-secondary-400 mb-1">{userAverage}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 font-semibold">Your Average Rating</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-accent-100 to-accent-50 dark:from-accent-600/20 dark:to-accent-700/20 border-accent-300 dark:border-accent-700">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-accent-200 dark:bg-accent-600/30 rounded-xl">
              <Award className="w-6 h-6 text-accent-700 dark:text-accent-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-accent-700 dark:text-accent-400 mb-1">{topRatedMeals.length}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 font-semibold">Top Rated Meals</p>
        </Card>
      </div>

      {/* Your Recent Ratings */}
      <div className="animate-slideUp">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 flex items-center gap-2">
            <Star className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Your Recent Ratings
          </h2>
        </div>

        {userRatings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRatings.map((rating) => (
              <Card key={rating._id} className="p-5 hover">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50">{rating.mealName}</h3>
                      <p className="text-xs text-dark-600 dark:text-dark-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(rating.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating rating={rating.rating} readonly size="sm" />
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {rating.rating}/5
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Star className="w-16 h-16 text-dark-400 dark:text-dark-600 mx-auto mb-4" />
            <p className="text-dark-600 dark:text-dark-400">
              No ratings yet. Start rating meals from the Daily Menu to see your history here!
            </p>
          </Card>
        )}
      </div>

      {/* Top Rated Meals */}
      {topRatedMeals.length > 0 && (
        <div className="animate-slideUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              Highest Rated Meals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRatedMeals.map((meal, index) => (
              <Card key={meal._id} className="p-5 bg-gradient-to-br from-light-100 to-light-50 dark:from-dark-700 dark:to-dark-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-600/30 text-secondary-700 dark:text-secondary-400 font-bold text-sm">
                        #{index + 1}
                      </span>
                      <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50">{meal._id}</h3>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(meal.averageRating)
                                ? 'fill-accent-500 text-accent-500'
                                : 'text-dark-400 dark:text-dark-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-dark-900 dark:text-dark-50">
                        {meal.averageRating.toFixed(2)}/5
                      </span>
                    </div>

                    <p className="text-xs text-dark-600 dark:text-dark-400 mt-2">
                      {meal.totalRatings} {meal.totalRatings === 1 ? 'rating' : 'ratings'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-light-100 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700 animate-slideUp">
        <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-2 flex items-center gap-2">
          <span>💡</span> Ratings Help Us Improve
        </h3>
        <p className="text-sm text-dark-600 dark:text-dark-300">
          Your ratings contribute to our ranking system and help the mess management understand which meals are liked most. The more you rate, the better we can tailor meals to student preferences!
        </p>
      </Card>
    </div>
  )
}

export default RatingsPage

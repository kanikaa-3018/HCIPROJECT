import { useState } from 'react'
import Card from './Card'
import StarRating from './StarRating'
import { ratingAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import { Leaf, CheckCircle, Info } from 'lucide-react'
import clsx from 'clsx'

function MealCard({ meal, mealType = 'lunch' }) {
  const [rating, setRating] = useState(0)
  const [avgRating, setAvgRating] = useState(meal.rating || 0)
  const [loading, setLoading] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const { addToast } = useToastStore()

  const handleRate = async (star) => {
    if (hasRated) {
      addToast('You have already rated this meal', 'info')
      return
    }
    
    setLoading(true)
    try {
      // Get today's date for the rating
      const today = new Date().toISOString().split('T')[0]
      await ratingAPI.submitRating(meal.id, meal.name, star, today)
      setRating(star)
      setHasRated(true)
      addToast('Rating submitted successfully!', 'success')
    } catch (error) {
      addToast('Failed to submit rating', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card hover className="p-5 md:p-6 bg-gradient-to-br from-light-100 to-light-50 dark:from-dark-700 dark:to-dark-800 group transition-all duration-300 overflow-hidden">
      <div className="space-y-4">
        {/* Meal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
              {meal.name}
            </h3>
            {meal.type === 'veg' && (
              <span className="text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 p-1.5 rounded border border-primary-300 dark:border-primary-700 flex-shrink-0" title="Vegetarian">
                <Leaf className="w-4 h-4" />
              </span>
            )}
            {meal.type === 'non-veg' && (
              <span className="text-accent-700 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/40 p-1.5 rounded border border-accent-300 dark:border-accent-700 flex-shrink-0 text-xs font-bold" title="Non-Vegetarian">
                NV
              </span>
            )}
          </div>
          
          {/* Description */}
          {meal.description && (
            <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
              {meal.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-light-200 dark:bg-dark-600" />

        {/* Stats Section */}
        <div className="space-y-3">
          {meal.spiceLevel && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-700 dark:text-dark-300 font-semibold min-w-fit">Spice:</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span 
                    key={i} 
                    className={clsx(
                      'w-2 h-5 rounded-full transition-all duration-300',
                      i < meal.spiceLevel 
                        ? 'bg-accent-500' 
                        : 'bg-light-300 dark:bg-dark-600'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Rating Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StarRating 
                rating={rating || avgRating} 
                onRate={hasRated ? null : handleRate}
                readonly={hasRated}
                size="sm"
              />
              <span className={`text-sm font-bold ${avgRating > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`}>
                {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : 'No ratings'}
              </span>
            </div>

            {rating > 0 && (
              <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                Your rating: {rating}/5
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MealCard

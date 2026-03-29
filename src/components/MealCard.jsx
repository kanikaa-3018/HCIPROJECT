import { useState } from 'react'
import Card from './Card'
import StarRating from './StarRating'
import { menuAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import { Leaf, CheckCircle } from 'lucide-react'
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
      await menuAPI.rateMeal(meal.id, star)
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
    <Card hover className="p-5 md:p-6 bg-gradient-to-br from-light-100 to-light-50 dark:from-dark-700 dark:to-dark-800 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{meal.name}</h3>
            {meal.type === 'veg' && (
              <span className="text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 p-1 rounded border border-primary-300 dark:border-primary-700">
                <Leaf className="w-4 h-4" />
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {meal.spiceLevel && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-dark-700 dark:text-dark-300">Spice Level:</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span 
                      key={i} 
                      className={clsx(
                        'w-2 h-6 rounded-full transition-all duration-300',
                        i < meal.spiceLevel 
                          ? 'bg-accent-500' 
                          : 'bg-light-300 dark:bg-dark-600'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <StarRating 
                rating={rating || avgRating} 
                onRate={hasRated ? null : handleRate}
                readonly={hasRated}
                size="sm"
              />
              <span className={`text-sm font-semibold ${avgRating > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`}>
                {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : 'No ratings'}
              </span>
            </div>

            {hasRated && (
              <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                Rated
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MealCard

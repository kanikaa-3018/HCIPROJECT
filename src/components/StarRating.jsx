import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'

function StarRating({ rating = 0, onRate = null, readonly = false, size = 'md', showText = true }) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }[size]

  const currentRating = hoverRating || rating

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readonly && onRate && onRate(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={clsx(
              sizeClass,
              'transition-all duration-200',
              !readonly && 'cursor-pointer hover:scale-110',
              readonly && 'cursor-default',
              currentRating >= star
                ? 'text-primary-400 fill-primary-400'
                : 'text-dark-600'
            )}
          >
            <Star />
          </button>
        ))}
      </div>
      {showText && rating > 0 && (
        <span className="text-xs font-semibold text-dark-400">
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  )
}

export default StarRating

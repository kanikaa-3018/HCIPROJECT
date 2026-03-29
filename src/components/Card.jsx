import clsx from 'clsx'

function Card({ children, className = '', hover = false, gradient = false, ...props }) {
  return (
    <div
      className={clsx(
        'bg-light-50 dark:bg-dark-700 rounded-2xl shadow-soft dark:shadow-soft border border-light-200 dark:border-dark-600 transition-all duration-300 backdrop-blur-sm',
        hover && 'hover:shadow-soft-md dark:hover:shadow-soft-lg hover:border-primary-400 dark:hover:border-primary-500 hover:-translate-y-1 hover:bg-light-100 dark:hover:bg-dark-600',
        gradient && 'bg-gradient-to-br from-light-100 to-light-200 dark:from-dark-700 dark:to-primary-900/30 border-primary-200 dark:border-primary-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

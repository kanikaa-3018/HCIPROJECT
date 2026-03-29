import clsx from 'clsx'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 text-white dark:text-dark-100 hover:shadow-glow-md dark:hover:shadow-glow-md hover:from-primary-600 dark:hover:from-primary-500 hover:to-primary-500 dark:hover:to-primary-400 active:shadow-glow-sm dark:active:shadow-glow-sm',
    secondary: 'bg-light-200 dark:bg-dark-700 text-dark-800 dark:text-dark-100 border border-light-300 dark:border-dark-600 hover:bg-light-300 dark:hover:bg-dark-600 hover:border-primary-400 dark:hover:border-primary-500 font-medium',
    outline: 'border-2 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-medium active:scale-95',
    danger: 'bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-600 dark:to-accent-500 text-white dark:text-dark-100 hover:shadow-glow-md dark:hover:shadow-glow-md hover:from-accent-700 dark:hover:from-accent-500 hover:to-accent-600 dark:hover:to-accent-400 font-medium',
    ghost: 'text-dark-700 dark:text-dark-200 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-dark-100 font-medium active:scale-95',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button

import clsx from 'clsx'

function Input({ label, error, icon: Icon, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-dark-800 dark:text-dark-200 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500 dark:text-dark-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={clsx(
            'w-full px-4 py-2.5 border-2 rounded-xl bg-light-50 dark:bg-dark-700 text-dark-900 dark:text-dark-100 placeholder-dark-500 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300',
            Icon && 'pl-10',
            error ? 'border-accent-500 dark:border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-light-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-600'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-accent-700 dark:text-accent-400 text-sm mt-1 font-medium">{error}</p>}
    </div>
  )
}

export default Input

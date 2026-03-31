import clsx from 'clsx'

function Select({ label, options, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-dark-800 dark:text-dark-200 mb-2">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2.5 border-2 rounded-xl bg-light-50 dark:bg-dark-700 text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-medium',
          error ? 'border-accent-500 dark:border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-light-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-600'
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-accent-700 dark:text-accent-400 text-sm mt-1 font-medium">{error}</p>}
    </div>
  )
}

export default Select

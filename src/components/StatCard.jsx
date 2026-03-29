import Card from './Card'
import clsx from 'clsx'

function StatCard({ label, value, icon: Icon, color = 'primary', trend = null }) {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-700',
    secondary: 'bg-secondary-100 dark:bg-secondary-600/20 text-secondary-700 dark:text-secondary-400 border border-secondary-300 dark:border-secondary-700',
    accent: 'bg-accent-100 dark:bg-accent-600/20 text-accent-700 dark:text-accent-400 border border-accent-300 dark:border-accent-700',
  }

  return (
    <Card className="p-6 hover animate-slideUp">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-600 dark:text-dark-400 text-sm font-semibold mb-2">{label}</p>
          <p className="text-4xl font-bold text-dark-900 dark:text-dark-50">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trend > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-accent-600 dark:text-accent-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-xl', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard

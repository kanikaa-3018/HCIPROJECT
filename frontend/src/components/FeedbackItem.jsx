import { CheckCircle, AlertCircle, Clock, User } from 'lucide-react'
import Card from './Card'
import clsx from 'clsx'

function FeedbackItem({ feedback }) {
  const getIssueColor = (issue) => {
    const colors = {
      taste: 'from-accent-100 to-accent-50 dark:from-accent-600/30 dark:to-accent-700/30 text-accent-700 dark:text-accent-400 border-accent-200 dark:border-accent-700',
      quantity: 'from-primary-100 to-primary-50 dark:from-primary-600/30 dark:to-primary-700/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-700',
      hygiene: 'from-secondary-100 to-secondary-50 dark:from-secondary-600/30 dark:to-secondary-700/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-700',
      other: 'from-primary-100 to-primary-50 dark:from-primary-600/30 dark:to-primary-700/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-700',
    }
    return colors[issue] || colors.other
  }

  const isResolved = feedback.status === 'resolved'

  return (
    <Card className="p-4 md:p-5 hover">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-bold text-dark-900 dark:text-dark-50">{feedback.mealName}</p>
            <p className="text-xs text-dark-600 dark:text-dark-400 mt-0.5">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isResolved ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-700">
              <CheckCircle className="w-4 h-4" />
              Resolved
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-100 dark:bg-accent-600/20 text-accent-700 dark:text-accent-400 rounded-full text-xs font-semibold border border-accent-200 dark:border-accent-700">
              <Clock className="w-4 h-4" />
              {feedback.status === 'reviewed' ? 'Reviewed' : 'Pending'}
            </div>
          )}
        </div>

        {/* Issue Type */}
        <div className="flex items-center gap-2">
          <span className={clsx('px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r border', getIssueColor(feedback.issueType))}>
            {feedback.issueType.charAt(0).toUpperCase() + feedback.issueType.slice(1)}
          </span>
        </div>

        {/* Feedback Text */}
        <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
          {feedback.comment}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
          {feedback.isAnonymous ? (
            <>
              <User className="w-4 h-4" />
              Anonymous feedback
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              Student feedback
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export default FeedbackItem

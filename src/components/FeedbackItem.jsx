import { CheckCircle, AlertCircle, Clock, User } from 'lucide-react'
import Card from './Card'
import clsx from 'clsx'

function FeedbackItem({ feedback }) {
  const getIssueColor = (issue) => {
    const colors = {
      taste: 'from-accent-600/30 to-accent-700/30 text-accent-400 border-accent-700',
      quantity: 'from-primary-600/30 to-primary-700/30 text-primary-400 border-primary-700',
      hygiene: 'from-secondary-600/30 to-secondary-700/30 text-secondary-400 border-secondary-700',
      other: 'from-primary-600/30 to-primary-700/30 text-primary-400 border-primary-700',
    }
    return colors[issue] || colors.other
  }

  return (
    <Card className="p-4 md:p-5 hover">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-bold text-dark-50">{feedback.meal}</p>
            <p className="text-xs text-dark-400 mt-0.5">
              {new Date(feedback.submittedDate).toLocaleDateString()}
            </p>
          </div>
          {feedback.resolved ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-full text-xs font-semibold border border-primary-700">
              <CheckCircle className="w-4 h-4" />
              Resolved
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-600/20 text-accent-400 rounded-full text-xs font-semibold border border-accent-700">
              <Clock className="w-4 h-4" />
              Pending
            </div>
          )}
        </div>

        {/* Issue Type */}
        <div className="flex items-center gap-2">
          <span className={clsx('px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r border', getIssueColor(feedback.issue))}>
            {feedback.issue.charAt(0).toUpperCase() + feedback.issue.slice(1)}
          </span>
        </div>

        {/* Feedback Text */}
        <p className="text-sm text-dark-300 leading-relaxed">
          {feedback.description}
        </p>

        {/* Tags */}
        {feedback.tags && feedback.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {feedback.tags.map((tag) => (
              <span key={tag} className="inline-block px-2.5 py-1 text-xs bg-dark-600 text-dark-300 rounded-full border border-dark-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Resolution Info */}
        {feedback.resolved && feedback.resolution && (
          <div className="mt-3 pt-3 border-t border-dark-600 bg-primary-900/30 rounded-lg p-3 border-primary-700">
            <p className="text-xs font-semibold text-primary-400 flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-4 h-4" />
              Warden's Resolution
            </p>
            <p className="text-sm text-primary-300">
              {feedback.resolution}
            </p>
            {feedback.resolvedDate && (
              <p className="text-xs text-primary-500 mt-2">
                Resolved on {new Date(feedback.resolvedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-dark-400">
          {feedback.anonymous ? (
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

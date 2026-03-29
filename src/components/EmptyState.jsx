import { AlertCircle } from 'lucide-react'

function EmptyState({ title, description, icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon className="w-16 h-16 text-dark-600 mb-4" />
      <h3 className="text-lg font-semibold text-dark-200 mb-2">{title}</h3>
      <p className="text-dark-400 text-center max-w-sm">{description}</p>
    </div>
  )
}

export default EmptyState

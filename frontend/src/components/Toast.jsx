import { useToastStore } from '../store/toastStore'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

function Toast() {
  const { toasts, removeToast } = useToastStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} flex items-center gap-3 justify-between min-w-80`}>
          <div className="flex items-center gap-2">
            {getIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => removeToast(toast.id)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast

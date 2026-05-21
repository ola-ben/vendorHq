import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { TooltipProvider } from './components/Tooltip.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TooltipProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              '!rounded-xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-xl !shadow-slate-900/10',
            description: '!text-slate-500',
            actionButton: '!bg-slate-900 !text-white',
            cancelButton: '!bg-slate-100 !text-slate-700',
            success: '!text-emerald-700',
            error: '!text-rose-700',
          },
        }}
      />
    </TooltipProvider>
  </StrictMode>,
)

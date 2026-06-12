import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles.css'
import App from './App'
import AdminPanel from './AdminPanel'

const queryClient = new QueryClient()
const isAdmin = window.location.pathname === '/admin_openmat'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdmin ? <AdminPanel /> : <App />}
    </QueryClientProvider>
  </StrictMode>,
)

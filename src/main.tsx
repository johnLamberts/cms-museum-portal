import appRouter from '@/routes/app.route'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from "sonner"
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <QueryClientProvider client={queryClient}>
          <div className="bg-[#E7E5E1]">
            <RouterProvider router={appRouter} />
            <Toaster richColors />
          </div>
       </QueryClientProvider>
  </StrictMode>,
)

import appRouter from '@/routes/app.route'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from "sonner"
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Adjust based on your needs
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <QueryClientProvider client={queryClient}>
          <div className="bg-[#E7E5E1]">
            <RouterProvider router={appRouter} />
            <Toaster richColors />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
  </StrictMode>,
)

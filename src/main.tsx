import appRouter from '@/routes/app.route'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="bg-[E7E5E1]">
      <RouterProvider router={appRouter} />
    </div>
  </StrictMode>,
)

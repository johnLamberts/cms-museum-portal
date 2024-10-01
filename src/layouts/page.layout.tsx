import SiteHeader from "@/components/site-header"
import { Outlet } from "react-router-dom"

const PageLayout = () => {
  return (
    <div className="bg-[E7E5E1]">

     {/* Header for pages */}
     <SiteHeader />

     <Outlet />

     
    </div>
  )
}

export default PageLayout

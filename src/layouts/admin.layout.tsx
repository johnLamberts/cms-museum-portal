
import { AppSidebar } from "@/components/app_sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LayoutPage from "@/modules/admin/layout.page";
import { Outlet } from "react-router-dom";


const AdminLayout = () => {
  // const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  
  return (
    // <div className="relative h-full bg-white">
    //     <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />{" "}
    //     <div
    //       id="content"
    //       className={`pt-24 transition-[margin] md:overflow-y-hidden md:pt-0 ${
    //         isCollapsed ? "md:ml-14" : "md:ml-72"
    //       } h-full`}
    //     >
    //       <LayoutPage>
    //         <Outlet />
    //       </LayoutPage>
    //     </div>
    // </div>

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <LayoutPage>
          <Outlet />
        </LayoutPage>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout

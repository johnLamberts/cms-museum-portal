import Sidebar from "@/components/sidebar";
import useIsCollapsed from "@/hooks/useIsCollapsed";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  
  return (
    <div className="relative h-full">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />{" "}
        <div
          id="content"
          className={`pt-24 transition-[margin] md:overflow-y-hidden md:pt-0 ${
            isCollapsed ? "md:ml-14" : "md:ml-72"
          } h-full`}
        >
          <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout

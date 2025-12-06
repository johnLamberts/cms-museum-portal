/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import useCurrentUser from "@/modules/authentication/useCurrentUser";
import { Link, Outlet, useLocation } from "react-router-dom";
import OverviewDashboard from "./overview.dashboard";

const DashboardPage = () => {
  const location = useLocation();


  const { user: currentUser } = useCurrentUser();

  
  const currentTab = (currentUser as any).userRole === "staff" ? "staff" : location.pathname.split("/").pop(); // Get current tab based on the route
  
  console.log(currentUser, currentTab)

  return (
    <Tabs defaultValue="overview">
      <div className="flex items-center">
        <TabsList>
          <Link to={'overview'}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </Link>
            
          <Link to={"detailed"}>
            <TabsTrigger value="detailed">Details</TabsTrigger>
          </Link>
        </TabsList>
      </div>

        {(currentUser as any).userRole.includes("staff") && (
          <TabsContent value={currentTab as string === "staff" ? "overview" : currentTab as string}>
            {currentTab === 'staff' ? <OverviewDashboard /> : <Outlet />}
          </TabsContent>
        )}

        {(currentUser as any).userRole.includes("admin") && (
          <TabsContent value={currentTab as string === "admin-dashboard" ? "overview" : currentTab as string}>
            {currentTab === 'admin-dashboard' ? <OverviewDashboard /> : <Outlet />}
          </TabsContent>
        )}
    </Tabs>
  )
}

export default DashboardPage

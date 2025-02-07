import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import { Link, Outlet, useLocation } from "react-router-dom";
import OverviewDashboard from "./overview.dashboard";

const DashboardPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop(); // Get current tab based on the route


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

        <TabsContent value={currentTab as string === "admin-dashboard" ? "overview" : currentTab as string}>
          {currentTab === 'admin-dashboard' ? <OverviewDashboard /> : <Outlet />}

        </TabsContent>
    </Tabs>
  )
}

export default DashboardPage

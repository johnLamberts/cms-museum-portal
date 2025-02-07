import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import { Link, Outlet, useLocation } from "react-router-dom";
import MuseumLists from "../museums/museums-list";

const MuseumPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop(); // Get current tab based on the route

  return (
    <Tabs defaultValue="museum-lists">
      <div className="flex items-center">
        <TabsList>
          <Link to={'museum-lists'}>
            <TabsTrigger value="museum-lists">All</TabsTrigger>
          </Link>
            
          <Link to={"archive_musuems"}>
            <TabsTrigger value="aboutpage">Archive</TabsTrigger>
          </Link>
        </TabsList>
      </div>

        <TabsContent value={currentTab as string === "museums" ? "museum-lists" : currentTab as string}>
          {currentTab === 'museums' ? <MuseumLists /> : <Outlet />}

        </TabsContent>
    </Tabs>
  )
}

export default MuseumPage

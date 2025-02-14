import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import { Link, Outlet, useLocation } from "react-router-dom";
import EventLists from "./event-lists";

const EventPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop(); // Get current tab based on the route

  return (
    <Tabs defaultValue="event-lists">
      <div className="flex items-center">
        <TabsList>
          <Link to={'event-lists'}>
            <TabsTrigger value="event-lists">All</TabsTrigger>
          </Link>
            
          <Link to={"archive_musuems"}>
            <TabsTrigger value="aboutpage">Incoming</TabsTrigger>
          </Link>
        </TabsList>
      </div>

        <TabsContent value={currentTab as string === "events" ? "event-lists" : currentTab as string}>
          {currentTab === 'events' ? <EventLists /> : <Outlet />}

        </TabsContent>
    </Tabs>
  )
}

export default EventPage

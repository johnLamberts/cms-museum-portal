import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import { Link, Outlet, useLocation } from "react-router-dom";
import HomeEditor from "./home.editor";

const PageEditorPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop(); // Get current tab based on the route

  return (
    <Tabs defaultValue="homepage">
      <div className="flex items-center">
        <TabsList>
          <Link to={'homepage'}>
            <TabsTrigger value="homepage">Home</TabsTrigger>
          </Link>
            
          <Link to={"aboutpage"}>
            <TabsTrigger value="aboutpage">About</TabsTrigger>
          </Link>
        </TabsList>
      </div>

        <TabsContent value={currentTab as string === "page_editor" ? "homepage" : currentTab as string}>
          {currentTab === 'page_editor' ? <HomeEditor /> : <Outlet />}

        </TabsContent>
    </Tabs>
  )
}

export default PageEditorPage

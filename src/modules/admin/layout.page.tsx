import { Layout, LayoutBody, LayoutHeader } from "@/components/layouts"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserHeader } from "@/components/user-header"
import { ReactNode } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

const LayoutPage = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { userid } = useParams();

  const identifierCrumb = (): string => {
    const lastRoute = pathname.split('/');
    const name = lastRoute[lastRoute.length - 1];

    let finalName = "";

    if(name === 'users') {
      finalName = "All Users"
    } else if (name === 'add_form') {
       finalName = "Create User"
    } else if (userid !== undefined) {
      finalName = "Modify User"
    }  else if (name === 'museums' || name === 'museum-lists') {
       finalName = "Manage museum details, and information"
    }  else if (name === 'add_museum') {
      finalName = "Create Museum"
    } else if (name === 'exhibits_mgm') {
      finalName = "All Exhibits "
    } else if (name === 'municipalities') {
      finalName = "All Municipalities "
    } else if (name === 'page_editor') {
      finalName = "Maximize your landing page capability"
    } else if (name === 'visitors') {
      finalName = "All Visitors"
    }


    return finalName;
  }

  console.log(identifierCrumb())

  const secondaryCrumb = (): string => {
    const lastRoute = pathname.split('/');
    
    const name =lastRoute.length > 3 ? lastRoute[lastRoute.length - 1] : lastRoute[2] ; 

    let finalName = "";

    if(name === 'users') {
      finalName = "Users"
    } else if (name === 'museums' || name === 'museum-lists') {
       finalName = "Museums"
    } else if (name === 'exhibits_mgm') {
      finalName = "Exhibits"
    } else if (name === 'visitors') {
    finalName = "Visitor"
    } else if (name === 'municipalities') {
      finalName = "Municipality"
    } else if (name === 'page_editor') {
      finalName = "Page Editor"
    }  
     

    return finalName;
  }



  return (
    <Layout>
    <LayoutHeader>
    <SidebarTrigger className="-ml-1" />

      <UserHeader
        headerName={
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={"/admin-dashboard"} className="font-light text-[#927B6B]">
                    Dashboard
                  </Link>
                  {/* <Link href="#">Dashboard</Link> */}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={"../users"} className="font-light  text-[#927B6B]">
                    {secondaryCrumb()}
                  </Link>
                  {/* <Link href="#">Users</Link> */}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {identifierCrumb().length < 2 ? 
              "Welcome Admin, Echo!"
                
              :
              (<>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#492309]">
                    {identifierCrumb()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>)
              }
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
    </LayoutHeader>
    <LayoutBody>
       {children}
    </LayoutBody>
  </Layout>
  )
}

export default LayoutPage

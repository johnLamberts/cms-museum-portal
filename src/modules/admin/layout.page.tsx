import { Layout, LayoutBody, LayoutHeader } from "@/components/layouts"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
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
    }  else if (name === 'museums') {
       finalName = "All Museums"
    }  else if (name === 'add_museum') {
      finalName = "Create Museum"
   }

    return finalName;
  }

  const secondaryCrumb = (): string => {
    const lastRoute = pathname.split('/');
    const name = lastRoute[2];

    console.log(lastRoute)
    let finalName = "";

    if(name === 'users') {
      finalName = "Users"
    } else if (name === 'museums') {
       finalName = "Museums"
    }

    return finalName;
  }


  return (
    <Layout>
    <LayoutHeader>
      <UserHeader
        headerName={
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={"/dashboard-app"} className="font-light text-[#927B6B]">
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#492309]">
                  {identifierCrumb()}
                </BreadcrumbPage>
              </BreadcrumbItem>
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

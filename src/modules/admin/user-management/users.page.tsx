import { Layout, LayoutBody, LayoutHeader } from "@/components/layouts";
import { UserHeader } from "@/components/user-header";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, Outlet, useLocation } from "react-router-dom";
const Users = () => {

  const { pathname } = useLocation();

  
  const identifierCrumb = (): string => {
    const lastRoute = pathname.split('/');
    const name = lastRoute[lastRoute.length - 1];

    let finalName = "";

    if(name === 'users') {
      finalName = "All Users"
    } else if (name === 'add_form') {
       finalName = "Create User"
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
                      Users
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
       <Outlet />
        {/* <ProductTable /> */}
      </LayoutBody>
    </Layout>
  );
};
export default Users;

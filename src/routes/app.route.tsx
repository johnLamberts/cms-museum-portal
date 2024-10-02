import AdminLayout from "@/layouts/admin.layout";
import HomeLayout from "@/layouts/home.layout";
import UserForm from "@/modules/admin/user-management/user-form";
import UsersList from "@/modules/admin/user-management/users-list";
import UsersPage from "@/modules/admin/user-management/users.page";
import LoginPage from "@/modules/authentication/login.page";
import GeneralError from "@/modules/errors/general-error.page";
import MoreAbout from "@/modules/landing-page/more-about.page";
import Museums from "@/modules/landing-page/museums.page";
import { createBrowserRouter } from "react-router-dom";

export const appRouter = createBrowserRouter([
  {
    path: '/',
    lazy: async () => { 
      const AppShell = await import('@/layouts/page.layout');
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        Component: HomeLayout
      },
      {
        path: '/home',
        Component: HomeLayout,
        errorElement: <GeneralError />
      },
      {
        path: '/about',
        Component: MoreAbout,
        errorElement: <GeneralError />
      },
      {
        path: '/museums',
        Component: Museums,
        errorElement: <GeneralError />
      }
    ]
  },
  {
    path: '/login',
    Component: LoginPage
  },
  {
    path: '/admin-dashboard',
    lazy: async () => { 
    const AppShell = await import('@/layouts/admin.layout');
    return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        Component: AdminLayout
      },
      {
        path: 'users',
        Component: UsersPage,
        children: [
         
          {
            index: true,
            Component: UsersList
          }, 
          {
            path: 'add_form',
            Component: UserForm
          }
        ]
      },
      
    ]
  }

])

export default appRouter;


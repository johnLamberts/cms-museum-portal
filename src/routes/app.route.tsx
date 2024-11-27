import HomeLayout from "@/layouts/home.layout";
import DashboardPage from "@/modules/admin/dashboard/dashboard.page";
import DetailedDashboard from "@/modules/admin/dashboard/detailed.dashboard";
import OverviewDashboard from "@/modules/admin/dashboard/overview.dashboard";
import EventPage from "@/modules/admin/events/events.page";
import ExhibitContentForm from "@/modules/admin/exhibits/exhibit-form.content";
import ExhibitsList from "@/modules/admin/exhibits/exhibits-list";
import ExhibitsPage from "@/modules/admin/exhibits/exhibits.page";
import MuseumContent from "@/modules/admin/museums/museum-content";
import MuseumLists from "@/modules/admin/museums/museums-list";
import MuseumPage from "@/modules/admin/museums/musuems.page";
import AboutEditor from "@/modules/admin/page-editor/about.editor";
import HomeEditor from "@/modules/admin/page-editor/home.editor";
import PageEditorPage from "@/modules/admin/page-editor/page-editor.page";
import MunicipalitiesList from "@/modules/admin/settings/municipalities/municipalities-list";
import MunicipalitiesPage from "@/modules/admin/settings/municipalities/municipalities.page";
import SettingsPage from "@/modules/admin/settings/settings.page";
import UserForm from "@/modules/admin/user-management/user-form";
import UsersList from "@/modules/admin/user-management/users-list";
import UsersPage from "@/modules/admin/user-management/users.page";
import VisitorForm from "@/modules/admin/visitors/visitor-form";
import VisitorList from "@/modules/admin/visitors/visitor-list";
import VisitorPage from "@/modules/admin/visitors/visitor.page";
import LoginPage from "@/modules/authentication/login.page";
import GeneralError from "@/modules/errors/general-error.page";
import { default as ExhibitLandPage } from "@/modules/landing-page/exhibits.page";
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
      },
      {
        path: '/exhibits',
        Component: ExhibitLandPage,
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
        Component: DashboardPage
      },
      {
        path: '/admin-dashboard',
        Component: DashboardPage,
        children: [
          {
            index: true,
            Component: OverviewDashboard
          },
          {
            path: 'overview',
            Component: OverviewDashboard
          },
          {
            path: 'detailed',
            Component: DetailedDashboard
          }
        ]
      },

      // Page editor
      {
        path: 'page_editor',
        Component: PageEditorPage,
        children: [
          {
            index: true,
            Component: HomeEditor
          },
          {
            path: 'homepage',
            Component: HomeEditor
          },
          {
            path: 'aboutpage',
            Component: AboutEditor
          },
          
        ]
      },
      // Users
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
          },
          {
            path: 'update_form/:userid',
            Component: UserForm
          }
        ]
      },
      // Visitors
      {
        path: 'visitors',
        Component: VisitorPage,
        children: [
          {
            index: true,
            Component: VisitorList
          }, 
         
          {
            path: 'add_form',
            Component: VisitorForm
          },
          {
            path: 'update_form/:visitorId',
            Component: VisitorForm
          }
        ]
      },
      //Museums
      {
        path: 'museums',
        Component: MuseumPage,
        children: [
          {
            index: true,
            Component: MuseumLists
          },
          {
            path: 'museum-lists',
            Component: MuseumLists
          }
        ],
      },
       //Exhibits
       {
        path: 'exhibits_mgm',
        Component: ExhibitsPage,
        children: [
          {
            index: true,
            Component: ExhibitsList
          }
        ],
      },
      {
        path: 'settings',
        Component: SettingsPage,
        children: [
          {
            index: true,
            Component: MunicipalitiesPage
          }, 
          {
            path: 'municipalities',
            Component: MunicipalitiesPage,
            children: [
              {
                index: true,
                Component: MunicipalitiesList
              }
            ]
          }
        ]
      },
      //Events
      {
        path: 'events',
        Component: EventPage,
      }
    ]
  },
  

  // For Musuem Form
  {
    path: '/musuem/add_museum',
    Component: MuseumContent
  },
  // For Exhibit Form
  {
    path: '/exhibits_mgm/add_exhibit',
    Component: ExhibitContentForm
  }


])

export default appRouter;


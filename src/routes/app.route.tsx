import HomeLayout from "@/layouts/home.layout";
import DashboardPage from "@/modules/admin/dashboard/dashboard.page";
import DetailedDashboard from "@/modules/admin/dashboard/detailed.dashboard";
import OverviewDashboard from "@/modules/admin/dashboard/overview.dashboard";
import DonationList from "@/modules/admin/donations/donation-list";
import DonationsPage from "@/modules/admin/donations/donations.page";
import EventContent from "@/modules/admin/events/event-content";
import EventDocumentation from "@/modules/admin/events/event-documentary";
import EventGallery from "@/modules/admin/events/event-gallery";
import EventLists from "@/modules/admin/events/event-lists";
import PublicPastEvents from "@/modules/admin/events/event-past-events";
import EventTestimonials from "@/modules/admin/events/event-testimonials";
import EventPage from "@/modules/admin/events/events.page";
import ExhibitContentForm from "@/modules/admin/exhibits/exhibit-form.content";
import ExhibitsList from "@/modules/admin/exhibits/exhibits-list";
import ExhibitsPage from "@/modules/admin/exhibits/exhibits.page";
import GalleryForm from "@/modules/admin/museum-gallery/gallery-form";
import GalleryList from "@/modules/admin/museum-gallery/gallery-list";
import MuseumGallery from "@/modules/admin/museum-gallery/museum-gallery.page";
import MuseumContent from "@/modules/admin/museums/museum-content";
import MuseumLists from "@/modules/admin/museums/museums-list";
import MuseumPage from "@/modules/admin/museums/musuems.page";
import AboutEditor from "@/modules/admin/page-editor/about.editor";
import HomeContent from "@/modules/admin/page-editor/home-editor/home-content";
import HomeEditor from "@/modules/admin/page-editor/home.editor";
import PageEditorPage from "@/modules/admin/page-editor/page-editor.page";
import BaranggayList from "@/modules/admin/settings/baranggay/baranggay-list";
import BaranggayPage from "@/modules/admin/settings/baranggay/baranggay.page";
import ExhibitionList from "@/modules/admin/settings/exhibition/exhibition-list";
import ExhibitionPage from "@/modules/admin/settings/exhibition/exhibition.page";
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
import AccountStatusPage from "@/modules/authentication/pending-approval";
import RegisterPage from "@/modules/authentication/register.page";
import GeneralError from "@/modules/errors/general-error.page";
import { default as ExhibitLandPage } from "@/modules/landing-page/exhibits.page";
import MoreAbout from "@/modules/landing-page/more-about.page";
import Museums from "@/modules/landing-page/museums.page";
import VisitorGalleryPage from "@/modules/visitor/visitor-artifacts-gallery.page";
import VisitorEventsPage from "@/modules/visitor/visitor-events.page";
import VisitorExhibitPage from "@/modules/visitor/visitor-exhibits.page";
import VisitorExperiencePage from "@/modules/visitor/visitor-experiences.page";
import VisitorHome from "@/modules/visitor/visitor-home.page";
import VisitorProfile from "@/modules/visitor/visitor-profile.page";
import VisitorVisitEvent from "@/modules/visitor/visitor-visit-event.page";
import VisitorVisitsExhibit from "@/modules/visitor/visitor-visits-exhibit.page";
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
        path: '/events',
        Component: EventPage,
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
    path: '/register',
    Component: RegisterPage
  },
  {
    path: "/pending-approval",
    Component: AccountStatusPage
  },
  {
    path: '/admin-dashboard',
    lazy: async () => { 

      const AdminLayout = await import('@/layouts/admin.layout');

      const { withAuth } = await import("@/routes/with-auth");
  
      const ProtectedAdminLayout = withAuth(AdminLayout.default, ["admin"])
  
      return { Component: ProtectedAdminLayout }

    // const AppShell = await import('@/layouts/admin.layout');
    // return { Component: AppShell.default }
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
          {
            path: 'home-content',
            Component: HomeContent // ✅ Corrected placement
          }
          
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
       // Museum Gallery
       {
        path: 'museum_gallery',
        Component: MuseumGallery,
        children: [
          {
            index: true,
            Component: GalleryList
          }, 
         
          {
            path: 'add_form',
            Component: GalleryForm
          },
          {
            path: 'update_form/:visitorId',
            Component: VisitorForm
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
          },
          {
            path: 'baranggay',
            Component: BaranggayPage,
            children: [
              {
                index: true,
                Component: BaranggayList
              }
            ]
          },
          {
            path: 'exhibition',
            Component: ExhibitionPage,
            children: [
              {
                index: true,
                Component: ExhibitionList
              }
            ]
          }
        ]
      },
      //Events
      {
        path: 'events',
        Component: EventPage,
        children: [
          {
            index: true,
            Component: EventLists
          },
          {
            path: 'museum-lists',
            Component: MuseumLists
          }
        ],
      },


      //Donations
      {
        path: 'donations',
        Component: DonationsPage,
        children: [
          {
            index: true,
            Component: DonationList
          },
          {
            path: 'donation-lists',
            Component: DonationList
          }
        ],
      },
    ]
  },
  {
    path: '/staff',
    lazy: async () => { 

      const AdminLayout = await import('@/layouts/staff.layout');

      const { withAuth } = await import("@/routes/with-auth");
  
      const ProtectedAdminLayout = withAuth(AdminLayout.default, ["staff"])
  
      return { Component: ProtectedAdminLayout }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        Component: DashboardPage
      },
      {
        path: '/staff',
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
          {
            path: 'home-content',
            Component: HomeContent // ✅ Corrected placement
          }
          
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
       // Museum Gallery
       {
        path: 'museum_gallery',
        Component: MuseumGallery,
        children: [
          {
            index: true,
            Component: GalleryList
          }, 
         
          {
            path: 'add_form',
            Component: GalleryForm
          },
          {
            path: 'update_form/:visitorId',
            Component: VisitorForm
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
          },
          {
            path: 'baranggay',
            Component: BaranggayPage,
            children: [
              {
                index: true,
                Component: BaranggayList
              }
            ]
          },
          {
            path: 'exhibition',
            Component: ExhibitionPage,
            children: [
              {
                index: true,
                Component: ExhibitionList
              }
            ]
          }
        ]
      },
      //Events
      {
        path: 'events',
        Component: EventPage,
        children: [
          {
            index: true,
            Component: EventLists
          },
          {
            path: 'museum-lists',
            Component: MuseumLists
          }
        ],
      },


      //Donations
      {
        path: 'donations',
        Component: DonationsPage,
        children: [
          {
            index: true,
            Component: DonationList
          },
          {
            path: 'donation-lists',
            Component: DonationList
          }
        ],
      },
    ]
  },
  {
    path: '/visitor',
    lazy: async () => { 
    const VisitorLayout = await import('@/layouts/visitor.layout');

    const { withAuth } = await import("@/routes/with-auth");

    const ProtectedVisitorLayout = withAuth(VisitorLayout.default, ["visitor"])

    return { Component: ProtectedVisitorLayout }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        Component: VisitorHome
      },
      {
        path: '/visitor',
        Component: VisitorHome
      },
      {
        path: 'profile',
        Component: VisitorProfile
      },
      {
        path: 'visitor_exhibits',
        Component: VisitorExhibitPage
      },
      {
        path: 'exhibits',
        Component: VisitorExhibitPage
      },
      {
        path: 'events',
        Component: VisitorEventsPage
      },
      {
        path: 'gallery',
        Component: VisitorGalleryPage
      },
      {
        path: 'exhibit/:exid',
        Component: VisitorVisitsExhibit
      },
      {
        path: 'event/:evid',
        Component: VisitorVisitEvent,
      },
      {
        path: 'experiences',
        Component: VisitorExperiencePage
      },
    ],
  },
  

  // For Musuem Form
  {
    path: '/musuem/add_museum',
    Component: MuseumContent
  },
  {
    path: '/musuem/update_museum/:exhibitId',
    Component: MuseumContent
  },
  // For Exhibit Form
  {
    path: '/exhibits_mgm/add_exhibit',
    Component: ExhibitContentForm
  },
  // For Event Form
  { 
    path: '/event/add_event',
    Component: EventContent
  },
  {
    path: '/event/update_event/:eventsId',
    Component: EventContent
  },
  {
    path: '/event/documentation/:eventId',
    Component: EventDocumentation
  },
  {
    path: '/event/gallery/:eventId',
    Component: EventGallery
  },
  {
    path: '/event/past-details/:eventId',
    Component: PublicPastEvents
  },
  {
    path: '/event/testimonials/:eventId',
    Component: EventTestimonials
  },
  // For Event Form
  {
    path: '/page_editor/home_editor',
    Component: HomeContent,

    lazy: async () => { 
      const AppShell = await import('@/modules/admin/page-editor/home-editor/home-content');
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
  },


])

export default appRouter;


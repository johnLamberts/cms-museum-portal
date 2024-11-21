import { cn } from "@/lib/utils";
import { CameraIcon, Cross1Icon, DashboardIcon, DoubleArrowLeftIcon, FaceIcon, FilePlusIcon, GearIcon, HamburgerMenuIcon, HomeIcon, Pencil2Icon, PersonIcon, RotateCounterClockwiseIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Layout, LayoutHeader } from "./layouts";
import Navbar, { SideLink } from "./navbar";
import { Button } from "./ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const sidelinks: SideLink[] = [
  {
    title: "Admin Dashboard",
    label: "",
    href: "/admin-dashboard",
    icon: <DashboardIcon height={18} />,
  },
  {
    title: "User Management",
    label: "",
    href: "users",
    icon: <PersonIcon height={18} />,
  },
  {
    title: "Visitor Management",
    label: "",
    href: "visitors",
    icon: <FaceIcon height={18} />,
  },
  {
    title: "Museums",
    label: "",
    href: "museums",
    icon: <HomeIcon height={18} />,
  },
  {
    title: "Exhibits Management",
    label: "",
    href: "exhibits_mgm",
    icon: <CameraIcon height={18} />,
  },
  {
    title: "Page Editor",
    label: "",
    href: "page_editor",
    icon: <CameraIcon height={18} />,
  },
  {
    title: "Reports",
    label: "",
    href: "/requests",
    icon: <FilePlusIcon height={18} />,
    sub: [
      {
        title: "Visitor Report",
        label: "9",
        href: "/trucks",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "User Report",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Exhibits Report",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      }
    ],
  },
  {
    title: "Audit Trail",
    label: "",
    href: "/transaction",
    icon: <Pencil2Icon height={18} />,
  },
  {
    title: "Settings",
    label: "",
    href: "settings",
    icon: <GearIcon height={18} />,
    sub: [
      {
        title: "Category",
        label: "9",
        href: "/category",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Municipalities",
        label: "9",
        href: "settings/municipalities",
        icon: <RotateCounterClockwiseIcon height={18} />,
      },
    ],
  },
];

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const [navOpened, setNavOpened] = useState<boolean>(false);

  useEffect(() => {
    const body = document.body.classList;

    if (navOpened) {
      body.add("overflow-hidden");
    } else {
      body.remove("overflow-hidden");
    }
  }, [navOpened]);
  return (
    <>
      <aside
        className={cn(
          `bg-[#E7E5E1] fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
            isCollapsed ? "md:w-14" : "md:w-72"
          }`,
          className
        )}
      >
        {/* Overlay in mobile */}
        <div
          onClick={() => setNavOpened(false)}
          className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
            navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
          } w-full bg-black md:hidden`}
        />

        <Layout  >
          {/* Header */}
          <LayoutHeader className="bg-[#E7E5E1] sticky top-0 justify-between px-4 py-3 shadow md:px-4">
            <div className={`flex items-center ${!isCollapsed ? "gap-1" : ""}`}>
              <img src="/mock/logo-ipsum.svg" className={`transition-all ${
                  isCollapsed ? "h-4 w-4" : "h-8 w-8"
                }`}
            alt="" />
              <div
                className={`flex flex-col justify-end truncate ${
                  isCollapsed ? "invisible w-0" : "visible w-auto"
                }`}
              >
                <span className="font-medium uppercase font-extrabold">
                  Museo Rizal
                </span>
              </div>
            </div>

            {/* Toggle Button in mobile */}
            <Button
              variant="gooeyRight"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
              aria-controls="sidebar-menu"
              aria-expanded={navOpened}
              onClick={() => setNavOpened((prev) => !prev)}
            >
              {navOpened ? <Cross1Icon /> : <HamburgerMenuIcon />}
            </Button>
          </LayoutHeader>

          {/* Navigation links */}
          <Navbar
            id="sidebar-menu"
            className={`bg-[#E7E5E1] h-full flex-1 overflow-auto border ${
              navOpened
                ? "max-h-screen"
                : "max-h-0 py-0 md:max-h-screen md:py-2"
            }`}
            closeNav={() => setNavOpened(false)}
            isCollapsed={isCollapsed}
            links={sidelinks}
          />

          {/* Scrollbar width toggle button */}
          <Button
            onClick={() => setIsCollapsed?.((prev) => !prev)}
            size="icon"
            variant="outline"
            className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
            style={{
              height: "2rem",
              width: "2rem",
            }}
          >
            <DoubleArrowLeftIcon
              className={`h-3 w-3 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </Button>
        </Layout>
      </aside>
    </>
  );
};
export default Sidebar;

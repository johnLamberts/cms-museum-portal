import { cn } from "@/lib/utils";
import { Cross1Icon, DashboardIcon, DoubleArrowLeftIcon, GearIcon, HamburgerMenuIcon, PersonIcon, RotateCounterClockwiseIcon } from "@radix-ui/react-icons";
import { BackpackIcon, FileTextIcon, IdCardIcon, } from "lucide-react";
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
    href: "/dashboard-app",
    icon: <DashboardIcon height={18} />,
  },
  {
    title: "Product Management",
    // label: "3",
    href: "/products",
    icon: <BackpackIcon height={18} />,
  },
  {
    title: "User Management",
    label: "9",
    href: "/users",
    icon: <PersonIcon height={18} />,
  },
  {
    title: "Customer Management",
    label: "9",
    href: "/customer-mgm",
    icon: <PersonIcon height={18} />,
  },
  {
    title: "Transaction",
    label: "",
    href: "/transaction",
    icon: <IdCardIcon height={18} />,
    sub: [
      {
        title: "Place order",
        label: "",
        href: "/sign-in",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Point of Sale",
        label: "",
        href: "/point-of-sale",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Transaction List",
        label: "",
        href: "/forgot-password",
        icon: <DashboardIcon height={18} />,
      },
    ],
  },
  {
    title: "Reports",
    label: "10",
    href: "/requests",
    icon: <FileTextIcon height={18} />,
    sub: [
      {
        title: "Sales Report",
        label: "9",
        href: "/trucks",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Inventory Report",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Customer Report",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Stock Report",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "Audit Trail",
        label: "",
        href: "/cargos",
        icon: <DashboardIcon height={18} />,
      },
    ],
  },
  {
    title: "Settings",
    label: "",
    href: "/settings",
    icon: <GearIcon height={18} />,
    sub: [
      {
        title: "Category",
        label: "9",
        href: "/category",
        icon: <DashboardIcon height={18} />,
      },
      {
        title: "User Role",
        label: "9",
        href: "/trucks",
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
          `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
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

        <Layout>
          {/* Header */}
          <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
            <div className={`flex items-center ${!isCollapsed ? "gap-1" : ""}`}>
              Logo
              <div
                className={`flex flex-col justify-end truncate ${
                  isCollapsed ? "invisible w-0" : "visible w-auto"
                }`}
              >
                <span className="font-medium uppercase font-extrabold">
                  KapeJuan
                </span>
                <span className="text-xs italic">Coffee Shop</span>
              </div>
            </div>

            {/* Toggle Button in mobile */}
            <Button
              variant="ghost"
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
            className={`h-full flex-1 overflow-auto border ${
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

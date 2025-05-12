/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  ActivityIcon,
  BookOpen,
  LayoutDashboard,
  PieChart,
  Settings2,
  UserIcon
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/app_sidebar/nav-main"
import { NavProjects } from "@/components/app_sidebar/nav-projects"
import { NavUser } from "@/components/app_sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useCurrentUser from "@/modules/authentication/useCurrentUser"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Users",
      url: "#",
      icon: UserIcon,
      items: [
        {
          title: "User Management",
          url: "users",
        },
        {
          title: "Visitor Management",
          url: "visitors",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Content Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Exhibits",
          url: "museums",
        },
        {
          title: "Events",
          url: "events",
        },
        {
          title: "Museum Gallery",
          url: "museum_gallery",
        },
        {
          title: "Site Editor",
          url: "page_editor",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Municipality",
          url: "settings/municipalities",
        },
        {
          title: "Baranggay",
          url: "settings/baranggay",
        },
        {
          title: "Exhibition",
          url: "settings/exhibition",
        },
      ],
    },
    {
      title: "Audit Trail",
      url: "audit_trails",
      icon: ActivityIcon,
    },
  ],
  projects: [
    
    {
      name: "Donations",
      url: "donations",
      icon: PieChart,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: currentUser } = useCurrentUser();
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <img src="/mock/logo-ipsum.svg" className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Museo Rizal</span>
                  <span className="truncate text-xs">Portal System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser as any} />
      </SidebarFooter>
    </Sidebar>
  )
}

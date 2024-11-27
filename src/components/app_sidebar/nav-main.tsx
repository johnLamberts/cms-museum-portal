"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from "react-router-dom"

interface NavSubItem {
  title?: string
  url?: string
}

interface NavItem {
  title?: string
  url?: string
  icon: LucideIcon 
  isActive?: boolean
  items?: NavSubItem[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation();

  const isActive = (item: NavItem): boolean => {
    if (item.isActive !== undefined) return item.isActive;
    if (pathname === item.url) return true;
    if (item.items) {
      return item.items.some(subItem => pathname === subItem.url);
    }
    return false;
  };

  const isSubItemActive = (subItem: NavSubItem): boolean => {

    const lastRoute = pathname.split('/');

    const name =lastRoute.length > 3 ? lastRoute[lastRoute.length - 1] : lastRoute[2];

    return name === subItem.url;
  };


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item);

          console.log(active)
          
          return (
            <Collapsible key={item.title} asChild defaultOpen={active}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                  <Link to={item.url || '#'}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          console.log(isSubItemActive(subItem))
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isSubItemActive(subItem)}
                              >
                                <Link to={subItem.url || '#'}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}


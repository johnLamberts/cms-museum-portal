import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Bell, Compass, Heart, Home, MessageCircle, PlayCircle, PlusSquare, Search, User } from 'lucide-react'
import { Link, NavLink, Outlet, } from 'react-router-dom'

const navItems = [
  { icon: Home, label: "Home", to: "/visitor" },
  { icon: Search, label: "Search", to: "/visitor/search" },
  { icon: Compass, label: "Explore Exhibits", to: "/visitor/explore" },
  { icon: PlayCircle, label: "Virtual Tours", to: "/visitor/tours" },
  { icon: MessageCircle, label: "Discussions", to: "/visitor/discussions" },
  { icon: Heart, label: "Notifications", to: "/visitor/notifications" },
  { icon: PlusSquare, label: "Share Experience", to: "/visitor/create" },
  { icon: User, label: "Profile", to: "profile" },
]


const VisitorLayout = () => {
  return (
    <div className="min-h-screen bg-background">
    {/* Top Navigation Bar */}
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="#">
              <span className="hidden font-bold sm:inline-block">Museo Rizal</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink className="transition-colors hover:text-foreground/80" to="/visitor">
                Home
              </NavLink>
              <NavLink className="transition-colors hover:text-foreground/80" to="/visitor">
                Exhibits
              </NavLink>
              <NavLink className="transition-colors hover:text-foreground/80" to="/visitor">
                Events
              </NavLink>
              <NavLink className="transition-colors hover:text-foreground/80" to="/visitor">
                Virtual Tours
              </NavLink>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search exhibits and events..." className="pl-8 md:w-[300px]" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

    {/* Main Content */}
    <main className="container py-6">
      <Outlet />
    </main>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex justify-around py-3">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} to={item.to} className="flex flex-col items-center gap-1">
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  </div>
  )
}

export default VisitorLayout

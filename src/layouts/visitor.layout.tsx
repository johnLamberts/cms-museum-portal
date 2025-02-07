import { Bell, Compass, Heart, Home, MessageCircle, PlayCircle, PlusSquare, Search, User } from 'lucide-react'
import { Link, Outlet, } from 'react-router-dom'

const navItems = [
  { icon: Home, label: "Home", to: "/visitor" },
  { icon: Search, label: "Search", to: "/visitor/search" },
  { icon: Compass, label: "Explore Exhibits", to: "/visitor/explore" },
  { icon: PlayCircle, label: "Virtual Tours", to: "/visitor/tours" },
  { icon: MessageCircle, label: "Discussions", to: "/visitor/discussions" },
  { icon: Heart, label: "Notifications", to: "/visitor/notifications" },
  { icon: PlusSquare, label: "Share Experience", to: "/visitor/create" },
  { icon: User, label: "Profile", to: "/visitor/profile" },
]


const VisitorLayout = () => {
  return (
    <div className="min-h-screen bg-white">
    {/* Top Navigation Bar */}
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/visitor" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Museo Rizal</span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/visitor/notifications" className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-6 w-6" />
          </Link>
          <Link to="/visitor/profile" className="p-2 hover:bg-gray-100 rounded-full">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 py-6">
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

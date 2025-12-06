import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const SiteHeader = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const { pathname } = useLocation();
  
  const navLinks = [
    { to: "/", label: "Home", paths: ["/", "/home"] },
    { to: "/about", label: "About Us", paths: ["/about"] },
    { to: "/exhibits", label: "Exhibits", paths: ["/exhibits"] },
    { to: "/events-page", label: "Events", paths: ["/events-page"] },
    { to: "/donations", label: "Donation", paths: ["/donations", "/donation"] },
  ];

  return (
    <header ref={ref}>
      <div
        className={`px-4 md:px-12 fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-slate-200/50 border-slate-300"
        }`}
      >
        <div
          className={`container flex items-center justify-between mx-auto duration-200 ${
            isIntersecting ? "p-1" : "py-4 md:p-6"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-lg md:text-xl font-bold antialiased py-4 text-slate-950 hover:text-neutral-900 transition-colors"
          >
            Tomas Museo Rizal
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`duration-200 hover:text-neutral-900 font-medium ${
                  link.paths.includes(pathname)
                    ? "text-neutral-900 border-b-2 border-neutral-900"
                    : "text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Separator orientation="vertical" className="h-6" />
            <Link
              to="/login"
              className={`duration-200 hover:text-neutral-900 font-medium ${
                pathname === "/login"
                  ? "text-neutral-900 underline"
                  : "text-slate-950"
              }`}
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`duration-200 hover:text-neutral-900 text-lg font-medium ${
                        link.paths.includes(pathname)
                          ? "text-neutral-900 underline"
                          : "text-slate-950"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator />
                  <Link
                    to="/login"
                    className={`duration-200 hover:text-neutral-900 text-lg font-medium ${
                      pathname === "/login"
                        ? "text-neutral-900 underline"
                        : "text-slate-950"
                    }`}
                  >
                    Sign In
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

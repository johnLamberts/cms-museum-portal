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
  console.log(pathname === "/home" )
  return (
    <header ref={ref}>
      <div
        className={` px-12 fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800 "
        }`}
      >
        <div
          className={`container flex flex-row-reverse items-center justify-between mx-auto duration-200 ${
            isIntersecting ? "p-1" : "p-6"
          }`}
        >
          <div className="hidden lg:flex justify-between gap-8 ">
            {/* <Link
              to="/projects"
              className={`duration-200 hover:text-neutral-900	 ${
                pathname === "/projects" ? "text-neutral-900	" : "text-slate-950	"
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`duration-200 hover:text-neutral-900	 ${
                pathname === "/projects" ? "text-neutral-900	" : "text-slate-950	"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`duration-200 hover:text-neutral-900	 ${
                pathname === "/about" ? "text-neutral-900	" : "text-slate-950	"
              }`}
            >
              Services
            </Link> */}
            <Link
              to="/login"
              className={`duration-200 hover:text-neutral-900	underline py-4 ${
                pathname === "/login" ? "text-neutral-900	" : "text-slate-950	"
              }`}
            >
              Sign In
            </Link>
          </div>

          {/* <div className="lg:hidden flex">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"}>
                  <HamburgerMenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col items-center justify-between gap-8">
                  <Link
                    to="/projects"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/projects"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    to="/projects"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/projects"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/about"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Services
                  </Link>
                  <Link
                    to="/contact"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/contact"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Contact Us
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div> */}

          <div className="flex space-between items-center space-x-4">
          <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"}>
                  <HamburgerMenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col items-center justify-between gap-8">
                  <Link
                    to="/"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/"  ||  pathname === "/home" 
                        ? "text-neutral-900 underline"
                        : "text-slate-950	"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/about"
                           ? "text-neutral-900 underline"
                        : "text-slate-950	"
                    }`}
                  >
                    About us
                  </Link>
                  <Link
                    to="/exhibits"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/projects"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Exhibits
                  </Link>
                  <Link
                    to="/museums"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/museums"
                        ? "text-neutral-900	underline"
                        : "text-slate-950	"
                    }`}
                  >
                    Museums
                  </Link>
                  <Link
                    to="/contact"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/contact"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    to="/contact"
                    className={`duration-200 hover:text-neutral-900	 ${
                      pathname === "/contact"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Contact Us
                  </Link>

                  <Separator />
                  <Link
                    to="/login"
                    className={`flex lg:hidden xl:hidden duration-200 hover:text-neutral-900	 ${
                      pathname === "/contact"
                        ? "text-neutral-900	"
                        : "text-slate-950	"
                    }`}
                  >
                    Sign In
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <Link
              to="/"
              className="text-md font-light antaliased py-4"
            >
              Museo Rizal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
// import ModeToggle from "./mode-toggle";
// import UserNav from "./user-nav";
import useCurrentUser from "@/modules/authentication/useCurrentUser";
import useLogout from "@/modules/authentication/useLogout";
import { SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";

const UserHeader = ({ headerName }: { headerName?: ReactNode | string }) => {


  
  return (
    <>
      {/* {pathname.includes("admin-dashboard") && <TopNav links={topNav} />} */}

      {/* {!pathname.includes("admin-dashboard") && (
        )} */}

      <p className="font-bold text-sm md:text-1xl">{headerName}</p>
      <div className="ml-auto flex items-center space-x-2 ">
        <div className="relative ml-auto flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            placeholder="Search..."
            type="search"
          />
        </div>
        <UserNav />
      </div>
    </>
  );
};

const UserNav = () => {
  const { user: currentUser } = useCurrentUser();

  const {logoutUser} = useLogout()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={(currentUser as any)?.userImg || '/avatar/user.png'} alt="@shadcn" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{(currentUser as any)?.firstName} {" "} {(currentUser as any)?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {(currentUser as any)?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() =>logoutUser()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export { UserHeader, UserNav };

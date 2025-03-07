import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useUsers from "./hooks/useUsers"
import UserContentForm from "./user-content.form"
import { IUser } from "./user.interface"


// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const safeAccess = (obj: any, path: string) => {
//   return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
// };
type RoleColor = {
  [key in 'admin' | 'staff' | 'visitor']: string;
};

const roleColors: RoleColor = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  staff: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  visitor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const RoleBadge = ({ role }: { role: string }) => {
  const color = role.toLowerCase() in roleColors
    ? roleColors[role.toLowerCase() as keyof RoleColor]
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <Badge className={`${color} capitalize`} variant="outline">
      {role}
    </Badge>
  );
};

const UsersList = () => {
  const navigate = useNavigate();
  const { data: usersData, isLoading, error } = useUsers();

  const memoUsers = useMemo(() => {
    return usersData?.data?.users || [];
  }, [usersData]);



  const pagination = useMemo(() => ({
    currentPage: usersData?.data?.currentPage?.page || 1,
    totalPages: usersData?.data?.totalPages || 1,
    totalDocs: usersData?.data?.totalDocs || 0,
    limit: usersData?.data?.currentPage?.limit || 20
  }), [usersData]);



  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading users...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
            Error loading users. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

   
    if (!memoUsers || memoUsers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            No users found.
          </TableCell>
        </TableRow>
      );
    }

    return memoUsers.map((user: IUser) => (
      <TableRow key={user.user_id}>
        <TableCell className="hidden sm:table-cell">
          <img
            alt={`${user.firstName}'s avatar`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={user.userImg}
            width="64"
          />
        </TableCell>
        <TableCell className="font-light">
          <span className="text-md font-bold">{user.firstName} {user.lastName}</span> <br />
          <span className="text-xs">{user.email}</span>
        </TableCell>
        <TableCell>
          <Badge variant="outline">Active</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <RoleBadge role={user.userRole || "admin"} />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {user.municipal_id}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {user.created_at}
        </TableCell>
        
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Actions for ${user.email}`}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`update_form/${user.user_id}`)}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger className="hidden sm:flex" value="archived">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative ml-auto flex-1 md:grow-0">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              placeholder="Search user..."
              type="search"
            />
          </div>
          <UserContentForm />
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#492309]">Users</CardTitle>
            <CardDescription>
              Manage your Users and view their profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Role
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.currentPage - 1) * pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalDocs)}</strong> of <strong>{pagination.totalDocs}</strong> Users
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default UsersList

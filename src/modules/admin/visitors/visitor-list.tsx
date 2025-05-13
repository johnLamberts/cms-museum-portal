/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle2,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
  XCircle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import useUpdateVisitorApprovedStatus from "./hooks/useUpdateApprovedVisitorStatus"
import useUpdateVisitor from "./hooks/useUpdateVisitor"; // Import the new hook
import useVisitors from "./hooks/useVisitor"
import VisitorContentForm from "./visitor-content.form"
import { IVisitor } from "./visitor.interface"

// Status badge component with appropriate styling for each status
const StatusBadge = ({ status }: { status: string }) => {
  const statusLower = status?.toLowerCase() || "active";

  // Define styling for different status types
  const statusStyles = {
    active: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    // Add more statuses as needed
  };

  const style = statusLower in statusStyles 
    ? statusStyles[statusLower as keyof typeof statusStyles]
    : "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge className={`${style} capitalize`} variant="outline">
      {statusLower}
    </Badge>
  );
};

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

// Types for confirmation modal
type ModalAction = "approve" | "reject" | "activate" | "deactivate" | "delete" | null;

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: ModalAction;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType,
  isLoading = false
}) => {
  // Determine button colors and icons based on action type
  const getButtonStyles = () => {
    switch (actionType) {
      case "approve":
        return {
          icon: <CheckCircle2 className="h-4 w-4 mr-2" />,
          className: "bg-green-600 hover:bg-green-700 text-white"
        };
      case "reject":
      case "delete":
        return {
          icon: <XCircle className="h-4 w-4 mr-2" />,
          className: "bg-red-600 hover:bg-red-700 text-white"
        };
      case "deactivate":
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-2" />,
          className: "bg-amber-600 hover:bg-amber-700 text-white"
        };
      case "activate":
        return {
          icon: <CheckCircle2 className="h-4 w-4 mr-2" />,
          className: "bg-green-600 hover:bg-green-700 text-white"
        };
      default:
        return {
          icon: null,
          className: "bg-primary hover:bg-primary/90"
        };
    }
  };

  const { icon, className } = getButtonStyles();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className={className} disabled={isLoading}>
            {isLoading ? (
              <Spinner className="h-4 w-4 mr-2" />
            ) : icon}
            {actionType === "approve" && "Approve"}
            {actionType === "reject" && "Reject"}
            {actionType === "activate" && "Activate"}
            {actionType === "deactivate" && "Deactivate"}
            {actionType === "delete" && "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VisitorList = () => {
  const { data: visitorsData, isLoading, error } = useVisitors();
  
  // Use both hooks for different operations
  const { isModifyVisitorApprovalStatus, updateVisitorStatusApprovalHandler } = useUpdateVisitorApprovedStatus();
  const { isModifyVisitor, updateVisitorHandler } = useUpdateVisitor();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<IVisitor | Record<string,any>>({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<IVisitor | null>(null);
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [confirmInProgress, setConfirmInProgress] = useState(false);

  // Clean up body style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  const memoVisitors = useMemo(() => {
    return visitorsData?.data?.visitors || []
  }, [visitorsData])

  console.log(memoVisitors)

  // Filter visitors by status if needed
  const filteredVisitors = useMemo(() => {
    let visitors = memoVisitors;
    
    // Filter by status first
    if (statusFilter !== "all") {
      visitors = visitors.filter((visitor: IVisitor) => 
        visitor.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Then filter by search term if it exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      visitors = visitors.filter((visitor: IVisitor) => 
        visitor.firstName?.toLowerCase().includes(term) || 
        visitor.lastName?.toLowerCase().includes(term) || 
        visitor.email?.toLowerCase().includes(term)
      );
    }
    
    return visitors;
  }, [memoVisitors, statusFilter, searchTerm]);

  const pagination = useMemo(
    () => ({
      currentPage: visitorsData?.data?.currentPage?.page || 1,
      totalPages: visitorsData?.data?.totalPages || 1,
      totalDocs: visitorsData?.data?.totalDocs || 0,
      limit: visitorsData?.data?.currentPage?.limit || 20,
    }),
    [visitorsData],
  );

  const handleAddVisitor = () => {
    setEditingVisitor({});
    setFormOpen(true);
  };

  const handleEditVisitor = (visitor: IVisitor) => {
    setEditingVisitor(visitor);
    setFormOpen(true);
  };
  
  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      // Use setTimeout to ensure it happens after the modal closes
      setTimeout(() => {
        setEditingVisitor({});
        document.body.style.removeProperty('pointer-events');
      }, 100);
    }
  };

  // Show confirmation modal
  const showConfirmation = (visitor: IVisitor, action: ModalAction) => {
    setSelectedVisitor(visitor);
    setModalAction(action);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    // Use setTimeout to ensure pointer-events is reset after modal animation completes
    setTimeout(() => {
      setSelectedVisitor(null);
      setModalAction(null);
      document.body.style.removeProperty('pointer-events');
      setConfirmInProgress(false); // Reset the in-progress state
    }, 300);
  };

  // Handle action confirmation
  const handleConfirmAction = async () => {
    if (!selectedVisitor || !modalAction || confirmInProgress) return;

    try {
      setConfirmInProgress(true); // Set in-progress to prevent multiple clicks
      
      if (modalAction === "approve") {
        // Call the updateVisitorStatusApprovalHandler to approve the visitor
        await updateVisitorStatusApprovalHandler({
          visitor_id: selectedVisitor.visitor_id,
          user_uid: selectedVisitor.user_uid,
          status: "Active", // Set status to Active when approving
          email: selectedVisitor.email
        });
      } else if (modalAction === "reject") {
        // Call API to reject the visitor
        await updateVisitorStatusApprovalHandler({
          visitor_id: selectedVisitor.visitor_id,
          user_uid: selectedVisitor.user_uid,
          status: "inactive", // Set status to inactive when rejecting
          email: selectedVisitor.email
        });
      } else if (modalAction === "activate") {
        // Call API to activate the visitor
        await updateVisitorStatusApprovalHandler({
          visitor_id: selectedVisitor.visitor_id,
          user_uid: selectedVisitor.user_uid,
          status: "Active", // Set status to Active when activating
          email: selectedVisitor.email
        });
      } else if (modalAction === "deactivate") {
        // Call API to deactivate the visitor
        await updateVisitorStatusApprovalHandler({
          visitor_id: selectedVisitor.visitor_id,
          user_uid: selectedVisitor.user_uid,
          status: "inactive", // Set status to inactive when deactivating
          email: selectedVisitor.email
        });
      } else if (modalAction === "delete") {
        // Use the regular updateVisitorHandler for delete operations
        await updateVisitorHandler({
          ...selectedVisitor,
          isDeleted: true
        });
      }
      
      // Close modal and reset state
      handleModalClose();
      
    } catch (error) {
      toast.error(`Failed to ${modalAction} visitor: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConfirmInProgress(false); // Reset in-progress state on error
    }
  };

  // Get modal content based on action
  const getModalContent = () => {
    if (!selectedVisitor || !modalAction) return { title: "", description: "" };

    const visitorName = `${selectedVisitor.firstName} ${selectedVisitor.lastName}`;
    
    switch (modalAction) {
      case "approve":
        return {
          title: "Approve Visitor Registration",
          description: `Are you sure you want to approve ${visitorName}'s registration? They will receive an email notification and will be able to access the system.`
        };
      case "reject":
        return {
          title: "Reject Visitor Registration",
          description: `Are you sure you want to reject ${visitorName}'s registration? This will mark their account as inactive and they will receive an email notification.`
        };
      case "activate":
        return {
          title: "Activate Visitor Account",
          description: `Are you sure you want to activate ${visitorName}'s account? They will be able to access the system again.`
        };
      case "deactivate":
        return {
          title: "Deactivate Visitor Account",
          description: `Are you sure you want to deactivate ${visitorName}'s account? They will not be able to access the system until reactivated.`
        };
      case "delete":
        return {
          title: "Delete Visitor Account",
          description: `Are you sure you want to permanently delete ${visitorName}'s account? This action cannot be undone.`
        };
      default:
        return { title: "", description: "" };
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading visitors...</span>
          </TableCell>
        </TableRow>
      )
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
            Error loading visitors. Please try again later.
          </TableCell>
        </TableRow>
      )
    }

    if (!filteredVisitors || filteredVisitors.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            No visitors found.
          </TableCell>
        </TableRow>
      )
    }

    return filteredVisitors.map((user: IVisitor) => (
      <TableRow key={user.visitor_id}>
        <TableCell className="hidden sm:table-cell">
          <img
            alt={`${user.firstName}'s avatar`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={user.visitorImg || "/placeholder.svg"}
            width="64"
          />
        </TableCell>
        <TableCell className="font-light">
          <span className="text-md font-bold">
            {user.firstName} {user.lastName}
          </span>{" "}
          <br />
          <span className="text-xs">{user.email}</span>
        </TableCell>
        <TableCell>
          <StatusBadge status={user.status || "Active"} />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <RoleBadge role={user.userRole || "visitor"} />
        </TableCell>
        <TableCell className="hidden md:table-cell">{user.created_at}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label={`Actions for ${user.email}`} size="icon" variant="ghost">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => handleEditVisitor(user)}>Edit</DropdownMenuItem>
              {user.status?.toLowerCase() === "pending" && (
                <>
                  <DropdownMenuItem className="text-green-600" onSelect={() => showConfirmation(user, "approve")}>
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onSelect={() => showConfirmation(user, "reject")}>
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {user.status?.toLowerCase() === "active" && (
                <DropdownMenuItem className="text-amber-600" onSelect={() => showConfirmation(user, "deactivate")}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {user.status?.toLowerCase() === "inactive" && (
                <DropdownMenuItem className="text-green-600" onSelect={() => showConfirmation(user, "activate")}>
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600" onSelect={() => showConfirmation(user, "delete")}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  }

  const modalContent = getModalContent();
  
  // Determine loading state based on the current action
  const isActionLoading = modalAction === "delete" ? isModifyVisitor : isModifyVisitorApprovalStatus;

  return (
    <>
      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative ml-auto flex-1 md:grow-0">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                placeholder="Search visitors..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-8 gap-1 bg-[#0B0400]" size="sm" variant="gooeyLeft" onClick={handleAddVisitor}>
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Visitor</span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Visitors</CardTitle>
              <CardDescription>Manage your Visitors and view their profile.</CardDescription>
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
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <strong>
                  {(pagination.currentPage - 1) * pagination.limit + 1}-
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalDocs)}
                </strong>{" "}
                of <strong>{pagination.totalDocs}</strong> Users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Active Visitors</CardTitle>
              <CardDescription>View and manage active visitors.</CardDescription>
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
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Pending Visitors</CardTitle>
              <CardDescription>Review and approve pending visitor registrations.</CardDescription>
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
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Inactive Visitors</CardTitle>
              <CardDescription>View and manage inactive visitors.</CardDescription>
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
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Visitor Content Form */}
      {formOpen && (
        <VisitorContentForm
          visitor={editingVisitor}
          isUpdateMode={!!editingVisitor.visitor_id}
          open={formOpen}
          onOpenChange={handleFormClose}
        />
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmAction}
        title={modalContent.title}
        description={modalContent.description}
        actionType={modalAction}
        isLoading={isActionLoading || confirmInProgress}
      />
    </>
  )
}

export default VisitorList

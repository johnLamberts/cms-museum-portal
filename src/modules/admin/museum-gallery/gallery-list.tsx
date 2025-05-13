/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { MoreHorizontalIcon, SearchIcon, StarIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import GalleryContentForm from "./gallery-content.form"
import useArtifacts from "./hooks/useUsers"
import { IArtifact } from "./user.interface"

type CategoryColor = {
  [key: string]: string;
};

// Define colors for different artifact categories
const categoryColors: CategoryColor = {
  "ancient-artifacts": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "classical-antiquities": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "fine-art": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "asian-collections": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "pre-columbian-art": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "literary-artifacts": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "science-technology": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  "indigenous-art": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "decorative-arts": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "modern-contemporary": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
};

// Component for category badge
const CategoryBadge = ({ category }: { category: string }) => {
  const color = category in categoryColors
    ? categoryColors[category]
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  // Map ID format to display name
  const displayName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Badge className={`${color} capitalize`} variant="outline">
      {displayName}
    </Badge>
  );
};

const GalleryList = () => {
  const { data: artifactsData, isLoading, error } = useArtifacts();

  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editingArtifact, setEditingArtifact] = useState<IArtifact | Record<string,any>>({});

  const memoArtifacts = useMemo(() => {
    return artifactsData?.data?.artifacts || [];
  }, [artifactsData]);

  // Filter artifacts based on search and active tab
  const filteredArtifacts = useMemo(() => {
    return memoArtifacts.filter((artifact: IArtifact) => {
      const matchesSearch = 
        artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "featured" && artifact.featured) ||
        (activeTab === "archived" && artifact.status === "archived");
      
      return matchesSearch && matchesTab;
    });
  }, [memoArtifacts, searchTerm, activeTab]);

  const pagination = useMemo(() => ({
    currentPage: artifactsData?.data?.currentPage?.page || 1,
    totalPages: artifactsData?.data?.totalPages || 1,
    totalDocs: artifactsData?.data?.totalDocs || 0,
    limit: artifactsData?.data?.currentPage?.limit || 20
  }), [artifactsData]);

  const handleAddArtifact = () => {
    setEditingArtifact({});
    setFormOpen(true);
  };

  const handleEditArtifact = (artifact: IArtifact) => {
    setEditingArtifact(artifact);
    setFormOpen(true);
  };

  // const handleDeleteArtifact = async (artifactId: string) => {
  //   if (window.confirm("Are you sure you want to delete this artifact?")) {
  //     await deleteArtifactHandler(artifactId);
  //   }
  // };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingArtifact({});
    // Force reset pointer-events on body
    document.body.style.pointerEvents = "auto";
  };

  // Reset pointer-events when formOpen changes
  useEffect(() => {
    if (!formOpen) {
      document.body.style.pointerEvents = "auto";
    }
  }, [formOpen]);

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading artifacts...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-[400px] text-center text-red-500">
            Error loading artifacts. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (filteredArtifacts.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-[400px] text-center">
            No artifacts found.
          </TableCell>
        </TableRow>
      );
    }

    return filteredArtifacts.map((artifact: IArtifact) => (
      <TableRow key={artifact.artifact_id}>
        <TableCell className="hidden sm:table-cell">
          <img
            alt={`${artifact.title}`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={artifact.artifactImg || "/placeholder.svg"}
            width="64"
          />
        </TableCell>
        <TableCell className="font-light">
          <span className="text-md font-bold">{artifact.title}</span> <br />
          <span className="text-xs">{artifact.period}</span>
        </TableCell>
        <TableCell>
          {artifact.featured ? (
            <Badge className="bg-amber-100 text-amber-800">
              <StarIcon className="mr-1 h-3 w-3" /> Featured
            </Badge>
          ) : (
            <Badge variant="outline">Standard</Badge>
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <CategoryBadge category={artifact.category} />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {artifact.municipal_id}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {artifact.created_at}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Actions for ${artifact.title}`}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => handleEditArtifact(artifact)}>Edit Artifact</DropdownMenuItem>
              {/* <DropdownMenuItem 
                onSelect={() => handleDeleteArtifact(artifact.artifact_id || "")}
                // disabled={isDeletingArtifact}
                className="text-red-600"
              >
                Delete Artifact
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All Artifacts</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger className="hidden sm:flex" value="archived">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative ml-auto flex-1 md:grow-0">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                placeholder="Search artifacts..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button 
              className="h-8 gap-1 bg-[#0B0400]" 
              size="sm" 
              variant="gooeyLeft" 
              onClick={handleAddArtifact}
            >
              <PlusCircledIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Artifact</span>
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Museum Artifacts</CardTitle>
              <CardDescription>
                Manage your museum's artifact collection and displays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Artifact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Added Date
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
                Showing <strong>{(pagination.currentPage - 1) * pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalDocs)}</strong> of <strong>{pagination.totalDocs}</strong> Artifacts
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="featured" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Featured Artifacts</CardTitle>
              <CardDescription>
                Manage your museum's highlighted and featured pieces.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Artifact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Added Date
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
          </Card>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#492309]">Archived Artifacts</CardTitle>
              <CardDescription>
                View and manage artifacts that are currently in storage or not on display.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Artifact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Added Date
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
          </Card>
        </TabsContent>
      </Tabs>

      {formOpen && (
        <GalleryContentForm
          artifact={editingArtifact}
          isUpdateMode={!!editingArtifact.artifact_id}
          open={formOpen}
          onOpenChange={handleFormClose}
        />
      )}
    </>
  );
};

export default GalleryList;

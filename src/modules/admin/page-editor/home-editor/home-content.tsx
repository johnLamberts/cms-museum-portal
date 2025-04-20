/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/admin/page-editor/home-editor/home-content.tsx
import { Surface } from "@/components/surface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import HomeForm from "./home-form";
import useCreateHomeEditor from "./hooks/useCreateHomeEditor";
import useViewHomeEditor from "./hooks/useViewHomeEditor";
import { Preview } from "./preview";


export type HomeFormData = {
  home_id?: string;
  homeContent?: any; // Using any for now but ideally should be a defined type
  updated_at?: string;
  created_at?: string;
  mode?: string;
    title: string;
    description: string;
    keywords: string;
}

const HomeContent = () => {
  const navigate = useNavigate();
  const form = useForm<HomeFormData>();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const { isAddingHomeEditor, addHomeHandler } = useCreateHomeEditor();
  const { homeView, isLoading: isLoadingHomeView } = useViewHomeEditor();

  // Pre-fill form with existing data when available
  useEffect(() => {
    if (homeView && !isLoadingHomeView) {
      form.reset({
        home_id: homeView.home_id,
        homeContent: homeView.homeContent || {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Welcome to your landing page" }]
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Start editing your content here..." }]
            }
          ]
        },
          title: "Landing Page",
          description: "Welcome to our website",
          keywords: "website, landing page",
        updated_at: homeView.updated_at,
        created_at: homeView.created_at
      });
    }
  }, [homeView, isLoadingHomeView, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(form.formState.isDirty);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle window/tab close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const onSubmit = async (data: HomeFormData) => {
    setIsLoading(true);
    try {
      await addHomeHandler({
        ...data,
        mode: "landing-page"
      });
      
      toast.success("Your landing page content has been saved.", {
        description: "Content will be available on your site immediately."
      });
      
      form.reset(data);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
      toast.error("Error saving content", {
        description: err instanceof Error ? err.message : "Unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/admin-dashboard/page_editor");
      }
    } else {
      navigate("/admin-dashboard/page_editor");
    }
  };

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-2 fixed bottom-6 right-6 z-[99999] p-2 shadow-lg rounded-lg">
      <Button 
        variant="outline" 
        disabled={isAddingHomeEditor || isLoading}
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button 
        disabled={isAddingHomeEditor || isLoading || !hasUnsavedChanges}
        type="submit" 
        className="bg-primary text-white hover:bg-primary/90" 
        onClick={form.handleSubmit(onSubmit)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </Surface>,
    document.body
  );

  if (isLoadingHomeView) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading editor...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
        <div className="border-b">
          <div className="container mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold">Landing Page Editor</h1>
            <p className="text-muted-foreground">
              Create and manage your website's landing page content
            </p>
            {hasUnsavedChanges && (
              <div className="mt-2">
                <span className="text-sm text-amber-500 font-medium">You have unsaved changes</span>
              </div>
            )}
          </div>
        </div>
        
        <Tabs 
          defaultValue="edit" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="container mx-auto py-4 px-6 flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="edit">Edit Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">SEO Settings</TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="outline" 
                disabled={isAddingHomeEditor || isLoading}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                disabled={isAddingHomeEditor || isLoading || !hasUnsavedChanges}
                type="submit"  
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <TabsContent value="edit" className="mt-0 flex-1 overflow-hidden">
            <Card className="border-0 shadow-none h-full">
              <CardContent className="p-0 h-full">
                <HomeForm form={form} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0 flex-1 overflow-auto">
            <Card>
              <CardContent className="pt-6">
                <Preview content={form.getValues().homeContent} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="font-medium text-sm">
                      Page Title (SEO)
                    </label>
                    <input
                      {...form.register("title")}
                      id="title"
                      className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                      placeholder="Homepage Title"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will appear in search engines and browser tabs
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="description" className="font-medium text-sm">
                      Meta Description
                    </label>
                    <textarea
                      {...form.register("description")}
                      id="description"
                      rows={3}
                      className="border border-input bg-background px-3 py-2 text-sm rounded-md resize-y"
                      placeholder="A brief description of your landing page"
                    />
                    <p className="text-xs text-muted-foreground">
                      This description appears in search engine results (recommended: 150-160 characters)
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="keywords" className="font-medium text-sm">
                      Keywords
                    </label>
                    <input
                      {...form.register("keywords")}
                      id="keywords"
                      className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                      placeholder="museum, history, culture, art"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated keywords for search engines
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {actionButtons}
        {/* Sonner toast container is added at the application root level */}
      </div>
    </>
  );
};

export default HomeContent;

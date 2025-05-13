/* eslint-disable @typescript-eslint/no-explicit-any */
import { Surface } from "@/components/surface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Changed from @/components/ui/use-toast

interface ContentEditorProps<T extends FieldValues> {
  title: string;
  description: string;
  form: UseFormReturn<T>;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (data: T) => Promise<void>;
  cancelPath: string;
  renderForm: () => React.ReactNode;
  renderPreview: () => React.ReactNode;
}

function ContentEditor<T extends FieldValues>({
  title,
  description,
  form,
  isLoading,
  isSaving,
  onSave,
  cancelPath,
  renderForm,
  renderPreview,
}: ContentEditorProps<T>) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("edit");

  const handleSubmit = async (data: T) => {
    try {
      await onSave(data);
      // Changed toast implementation to use Sonner
      toast.success("Content saved successfully", {
        description: "Your content has been saved.",
      });
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
      // Changed toast implementation to use Sonner
      toast.error("Error saving content", {
        description: err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  };

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-2 fixed bottom-6 right-6 z-[99999] p-2 shadow-lg rounded-lg">
      <Button 
        variant="outline" 
        disabled={isLoading || isSaving}
        onClick={() => navigate(cancelPath)}
      >
        Cancel
      </Button>
      <Button 
        disabled={isLoading || isSaving}
        type="submit" 
        className="bg-primary text-white hover:bg-primary/90" 
        onClick={form.handleSubmit(handleSubmit)}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : "Save Changes"}
      </Button>
    </Surface>,
    document.body
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading editor...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="edit" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="container mx-auto py-4 px-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {renderForm()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                {renderPreview()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {actionButtons}
        {/* Removed Toaster since Sonner has its own provider */}
      </div>
    </>
  );
}

export default ContentEditor;


interface UseContentEditorProps<T extends FieldValues, R> {
  form: UseFormReturn<T>;
  query: {
    data?: R;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };
  mutation: {
    mutateAsync: (data: T) => Promise<any>;
    isPending: boolean;
  };
  mapQueryDataToForm?: (data: R) => Partial<T>;
}

export function useContentEditor<T extends FieldValues, R>({
  form,
  query,
  mutation,
  mapQueryDataToForm,
}: UseContentEditorProps<T, R>) {
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form with existing data when available
  useEffect(() => {
    if (query.data && !query.isLoading && mapQueryDataToForm) {
      const formData = mapQueryDataToForm(query.data);
      form.reset(formData as T);
    }
  }, [query.data, query.isLoading, form, mapQueryDataToForm]);

  // Handle error in query
  useEffect(() => {
    if (query.isError) {
      // Changed toast implementation to use Sonner
      toast.error("Error loading content", {
        description: query.error instanceof Error ? query.error.message : "Failed to load content",
      });
    }
  }, [query.isError, query.error]);

  const handleSave = async (data: T) => {
    setIsSaving(true);
    try {
      await mutation.mutateAsync(data);
      // Changed toast implementation to use Sonner
      toast.success("Content saved successfully", {
        description: "Your content has been saved.",
      });
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
      // Changed toast implementation to use Sonner
      toast.error("Error saving content", {
        description: err instanceof Error ? err.message : "Unknown error occurred",
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading: query.isLoading,
    isSaving: isSaving || mutation.isPending,
    handleSave,
  };
}

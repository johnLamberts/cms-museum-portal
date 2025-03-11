/* eslint-disable @typescript-eslint/no-explicit-any */
import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MuseumLoader from "./exhibit-loader";
import useCreateMuseum from "./hooks/useCreateMuseum";
import { useBlockEditor } from "./hooks/useMuseumEditor";
import { useExhibit } from "./hooks/useMuseums";
import useUpdateExhibit from "./hooks/useUpdateExhibit";
import MuseumForm from "./musuem-form";

export type MuseumFormData = {
  title: string;
  coverPhoto: string;
  colorTheme: string;
  museumContent?: string | any;
  expectedTime?: string;
  exhibitExclusiveDate?: string;
  curalator?: string;
  fee?: string; 
};

const defaultValues = {
  title: "",
  coverPhoto: "",
  colorTheme: "",
  museumContent: "",
  address: "",
  fee: "",
  expectedTime: "",
  exhibitExclusiveDate: "",
  curalator: "",
};

const MuseumContent = () => {
  const navigate = useNavigate();
  const { data: exhibit, isLoading } = useExhibit();
  const { isAddingMuseum, addMuseumHandler } = useCreateMuseum();
  const { isUpdatingExhibit, updateExhibitHandler } = useUpdateExhibit();
  
  // Keep track of whether we've already set up the editor content
  const contentSetupComplete = useRef(false);
  
  // Safely destructure exhibit
  const { exhibits_id, ...otherData } = exhibit || {};
  const isEditingMode = Boolean(exhibits_id);
  
  console.log("Exhibit loaded:", !!exhibit);
  console.log("Is editing mode:", isEditingMode);
  
  // Get the block editor
  const { editor, setContent } = useBlockEditor();
  
  // Setup form with appropriate defaults
  const form = useForm<MuseumFormData>({
    defaultValues,
  });

  // This is the key effect to handle synchronization between exhibit data and editor
  useEffect(() => {
    // Only proceed if we're in editing mode, have exhibit data, have an editor, and haven't already set up
    if (isEditingMode && exhibit && editor && !contentSetupComplete.current) {
      console.log("SETUP: All conditions met for content synchronization");
      
      // Add debug to check the actual museumContent
      console.log("SETUP: Museum content to load:", otherData.museumContent);
      
      // 1. Extract the data we need from the exhibit
      const exhibitData = {
        title: otherData.title || "",
        coverPhoto: otherData.coverPhoto || "",
        colorTheme: otherData.colorTheme || "",
        museumContent: otherData.museumContent || "",
        address: otherData.address || "",
        fee: otherData.fee || "",
        expectedTime: otherData.expectedTime || "",
        exhibitExclusiveDate: otherData.exhibitExclusiveDate || "",
        curalator: otherData.curalator || "",
};
      
      // 2. Reset the form with the exhibit data
      form.reset(exhibitData);

      
      // 3. Add a more reliable way to set editor content
      if (exhibitData.museumContent) {
        // Try both methods with better error handling
        try {
          // First try your custom setContent method
          const success = setContent(exhibitData.museumContent);

          
          console.log("SETUP: Editor setContent result:", success);
          
          // If that fails, use the editor's direct method with a small delay
          if (!success && editor) {
              try {
                editor.commands.setContent(exhibitData.museumContent);
                console.log("SETUP: Successfully set content using editor commands");
              } catch (err) {
                console.error("SETUP: Failed to set editor content:", err);
              }
          }
        } catch (err) {
          console.error("SETUP: Error setting content:", err);
        }
      }
      
      // Mark setup as complete to prevent repeated attempts
      contentSetupComplete.current = true;
    }
  }, [isEditingMode, exhibit, editor, otherData, form, setContent]);
  // Update form when editor content changes
  useEffect(() => {
    if (editor) {
      const updateFormContent = () => {
        const html = editor.getJSON();
        form.setValue("museumContent", html, { shouldDirty: true });
      };
      
      editor.on("update", updateFormContent);
      return () => {
        editor.off("update", updateFormContent);
      };
    }
  }, [editor, form]);

  const onSubmit = async (data: MuseumFormData) => {
    // Always get the latest editor content
    const editorContent = editor ? editor.getJSON() : data.museumContent;
    const updatedData = {
      ...data,
      museumContent: editorContent,
    };

    console.log("SUBMIT: Form data", data);
    console.log("SUBMIT: Editor content length", editorContent.length);
    
    try {
      if (isEditingMode) {
        await updateExhibitHandler({
          ...updatedData,
          exhibits_id
        });
      } else {
        await addMuseumHandler(updatedData);
        console.log(updatedData)
      }
      navigate("/admin-dashboard/museums");
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
    }
  };

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingExhibit : isAddingMuseum}
        onClick={() => navigate("/admin-dashboard/museums")}
      >
        Back
      </Toolbar.Button>
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingExhibit : isAddingMuseum}
        type="submit"
        className="bg-[#927B6B]/95 text-white"
        onClick={form.handleSubmit(onSubmit)}
      >
        {isEditingMode ? "Update" : "Save"}
      </Toolbar.Button>
    </Surface>,
    document.body
  );

  if (isLoading) return <MuseumLoader />;

  return (
    <div className="flex flex-col h-screen">
      {/* Debug overlay */}
      {isEditingMode && (
        <div className="fixed top-0 left-0 bg-black/70 text-white p-2 text-xs z-[999999]">
          Editing Mode: {isEditingMode ? 'Yes' : 'No'} | 
          Exhibit ID: {exhibits_id} | 
          Editor Ready: {editor ? 'Yes' : 'No'} |
          Content Set: {contentSetupComplete.current ? 'Yes' : 'No'}
        </div>
      )}
      
      {actionButtons}
      <MuseumForm 
        editor={editor}
        form={form} 
        isEditingMode={isEditingMode} 
        exhibit={exhibit} 
      />
    </div>
  );
};

export default MuseumContent;

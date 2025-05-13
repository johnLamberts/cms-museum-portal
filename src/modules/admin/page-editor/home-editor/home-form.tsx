/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/admin/page-editor/home-editor/HomeForm.tsx
import { TextMenu } from "@/components/content-menus/text-menus/text-menu";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentBlockMenu } from "@/modules/extensions/content-block/content-block-menu";
import ImageBlockMenu from "@/modules/extensions/image-block/image-menu.block";
import { LayoutMenu } from "@/modules/extensions/layout-menu";
import { EditorContent } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBlockPageEditor } from "./hooks/usePageBlockEditor";
import { MediaMenu } from "./main-menu";

const HomeForm = ({ form }: any) => {
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const { editor, setInitialContent, isInitialized } = useBlockPageEditor();

  useEffect(() => {
    if (editor && !editor.isDestroyed && !isInitialized) {
      const homeContent = form.getValues().homeContent;
      
      console.log(homeContent);
      
      if (homeContent) {
        console.log("Loading initial content from form:", homeContent);
        // Small delay to ensure the editor is fully initialized
        setTimeout(() => {
          setInitialContent(homeContent);
          setIsContentLoaded(true);
        }, 50);
      } else {
        // No content to load, mark as loaded
        setIsContentLoaded(true);
      }
    }
  }, [editor, form, setInitialContent, isInitialized]);

  // Update form values when editor content changes
  useEffect(() => {
    if (editor && !editor.isDestroyed && isContentLoaded) {
      const updateFormContent = () => {
        // Save the entire editor state as JSON
        const content = editor.getJSON();
        form.setValue("homeContent", content, { shouldDirty: true });
      };

      editor.on("update", updateFormContent);

      return () => {
        editor.off("update", updateFormContent);
      };
    }
  }, [editor, form, isContentLoaded]);

  // If editor is still loading
  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full border rounded-md bg-white">
              <div className="mx-auto max-w-4xl px-4 py-8">
                {/* <EditorContent editor={editor} className="prose max-w-none min-h-[500px]" /> */}
              
                {!isContentLoaded ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <p className="text-muted-foreground">Loading content...</p>
                  </div>
                ) : (
                  <EditorContent editor={editor} className="prose max-w-none min-h-[500px]" />
                )}
              
              </div>
            </ScrollArea>
          </div>

          <div ref={menuContainerRef} className="sticky bottom-0 right-0 left-0 bg-background border-t z-10 py-2">
            <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2">
              <ContentBlockMenu editor={editor} />
                            <TextMenu editor={editor} />
                            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
              
              {/* <TextFormatMenu editor={editor} /> */}
              <LayoutMenu editor={editor} appendTo={menuContainerRef} />
              <MediaMenu editor={editor} appendTo={menuContainerRef} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HomeForm;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ContentItemMenu } from "@/components/content-menus/content-item-menu"
import LinkMenu from "@/components/content-menus/link-menu"
import { TextMenu } from "@/components/content-menus/text-menus/text-menu"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import GalleryMenu from "@/modules/extensions/gallery/gallery-menu"
import ImageBlockMenu from "@/modules/extensions/image-block/image-menu.block"
import ColumnsMenu from "@/modules/extensions/multicolumn/columns-menu"
import TableColumnMenu from "@/modules/extensions/table/menus/table-column"
import TableRowMenu from "@/modules/extensions/table/menus/table-row"
import "@/styles/partials/index.css"
import { EditorContent } from "@tiptap/react"
import { useRef } from "react"
import MuseumHeaderForm from "./components/museum-header"

interface MuseumProps {
  form: any;
  editor?: any;
  isEditingMode?: boolean;
  exhibit?: Record<string, any>;
}

const MuseumForm = ({ form, editor }: MuseumProps) => {
  const menuContainerRef = useRef<HTMLDivElement | null>(null);


  // No need to try to sync editor content here - it's handled in MuseumContent

  if (!editor) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-grow">
          <MuseumHeaderForm editor={editor} form={form} />
          
          <div className="flex flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="max-w-4xl mx-auto p-6">
                  <EditorContent editor={editor} className="prose max-w-none" />
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <div ref={menuContainerRef} className="sticky bottom-0 bg-background border-t">
            <>
              <ContentItemMenu editor={editor} />
              <TextMenu editor={editor} />
              <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
              <LinkMenu editor={editor} appendTo={menuContainerRef} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
              <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
              <GalleryMenu editor={editor} appendTo={menuContainerRef} />
            </>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MuseumForm;

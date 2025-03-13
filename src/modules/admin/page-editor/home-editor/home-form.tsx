/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ContentItemMenu } from "@/components/content-menus/content-item-menu"
import LinkMenu from "@/components/content-menus/link-menu"
import { TextMenu } from "@/components/content-menus/text-menus/text-menu"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageBlockMenu } from "@/modules/extensions/image-block/image-menu.block"
import { ColumnsMenu } from "@/modules/extensions/multicolumn/columns-menu"
import { TableColumnMenu } from "@/modules/extensions/table/menus/table-column"
import { TableRowMenu } from "@/modules/extensions/table/menus/table-row"
import "@/styles/partials/index.css"
import { EditorContent } from "@tiptap/react"
import { useEffect, useRef } from "react"
import { useBlockEditor } from "./hooks/useHomeEditor"

 
const HomeForm = ({ form }: any) => {
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const { editor } = useBlockEditor()


  


  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const updateFormContent = () => {
        // Save the entire editor state as JSON
        const content = editor.getJSON()
        form.setValue("homeContent",content, { shouldDirty: true })
      }

      editor.on("update", updateFormContent)

      return () => {
        editor.off("update", updateFormContent)
      }
    }
  }, [editor, form])


  if (!editor) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-grow">
          <div className="flex flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="mx-auto max-w-4xl px-4 py-8">
                  <EditorContent editor={editor} className="prose max-w-none" />
                </div>
              </ScrollArea>
            </div>
          </div>

          <div ref={menuContainerRef} className="sticky bottom-0 right-0 left-0 bg-background border-t z-10">
            <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-2">
              <ContentItemMenu editor={editor} />
              <TextMenu editor={editor} />
              <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
              <LinkMenu editor={editor} appendTo={menuContainerRef} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
              <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default HomeForm

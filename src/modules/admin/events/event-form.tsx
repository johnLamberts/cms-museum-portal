/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ContentItemMenu } from "@/components/content-menus/content-item-menu"
import LinkMenu from "@/components/content-menus/link-menu"
import { TextMenu } from "@/components/content-menus/text-menus/text-menu"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageBlockMenu from "@/modules/extensions/image-block/image-menu.block"
import { EditorContent } from "@tiptap/react"
import { useEffect, useRef } from "react"
import { useWatch } from "react-hook-form"
import { useBlockEditor } from "../museums/hooks/useMuseumEditor"
// import EditorMenuBar from "./components/editor-menu-bar"
import "@/styles/partials/index.css"
import EventmHeaderForm from "./event-header"



const EventForm = ({ form }: any) => {
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const { editor } = useBlockEditor()

  // const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const editorContent = useWatch({
    control: form.control,
    name: 'eventContent',
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const updateFormContent = () => {
        form.setValue('eventContent', editor.getHTML(), { shouldDirty: true })
      }

      editor.on('update', updateFormContent)

      return () => {
        editor.off('update', updateFormContent)
      }
    }
  }, [editor, form])

  useEffect(() => {
    if (editor && !editor.isDestroyed && editorContent !== editor.getHTML()) {
      editor.commands.setContent(editorContent)
    }
  }, [editor, editorContent])

  if (!editor) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-grow">
          <EventmHeaderForm editor={editor} form={form} />
          
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
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EventForm


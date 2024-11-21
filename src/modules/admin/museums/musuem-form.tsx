import { ContentItemMenu } from "@/components/content-menus/content-item-menu";
import LinkMenu from "@/components/content-menus/link-menu";
import { TextMenu } from "@/components/content-menus/text-menus/text-menu";
import { Form } from "@/components/ui/form";
import ImageBlockMenu from "@/modules/extensions/image-block/image-menu.block";
import "@/styles/partials/index.css";
import { EditorContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import MuseumHeaderForm from "./components/museum-header";
import { useBlockEditor } from "./hooks/useMuseumEditor";

 
const MuseumForm = ({ form }: { form: ReturnType<typeof useForm>}) => {


  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  
  const {editor} = useBlockEditor();

  const editorContent = useWatch({
    control: form.control,
    name: 'museumContent', // This is the field name for the editor content in the form
  })



  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const updateFormContent = () => {
        form.setValue('editorContent', editor.getHTML(), { shouldDirty: true })
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



  if(!editor) return null;

  

  
  return (
    <>
        <div className="flex h-full" ref={menuContainerRef}>

          <div className="relative flex flex-col flex-1 h-full overflow-hidden">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                <MuseumHeaderForm
                  editor={editor}
                  form={form}
                />
                <EditorContent editor={editor} className="flex-1 overflow-y-auto" />

                <ContentItemMenu editor={editor} />

                {/* <ColumnsMenu editor={editor} appendTo={menuContainerRef} /> */}

                <LinkMenu editor={editor} appendTo={menuContainerRef}  />

                <TextMenu editor={editor} />

                <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />

              </form>
            </Form>

          </div>
        </div>
    
    </>
  )
}

export default MuseumForm

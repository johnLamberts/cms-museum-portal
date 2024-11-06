import { ContentItemMenu } from "@/components/content-menus/content-item-menu";
import LinkMenu from "@/components/content-menus/link-menu";
import { TextMenu } from "@/components/content-menus/text-menus/text-menu";
import ImageBlockMenu from "@/modules/extensions/image-block/image-menu.block";
import "@/styles/partials/index.css";
import { EditorContent } from "@tiptap/react";
import { useRef } from "react";
import { useBlockEditor } from "../museums/hooks/useMuseumEditor";
import ExhibitHeaderForm from "./components/museum-header";


const ExhibitContentForm = () => {


  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  
  const {editor} = useBlockEditor();

  if(!editor) return null;

  
  return (
    <>
        <div className="flex h-full" ref={menuContainerRef}>

          <div className="relative flex flex-col flex-1 h-full overflow-hidden">
            <ExhibitHeaderForm
              editor={editor}
            />
            <EditorContent editor={editor} className="flex-1 overflow-y-auto" />

            <ContentItemMenu editor={editor} />

            {/* <ColumnsMenu editor={editor} appendTo={menuContainerRef} /> */}

            <LinkMenu editor={editor} appendTo={menuContainerRef}  />

            <TextMenu editor={editor} />

            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />

          </div>
        </div>
    
    </>
  )
}

export default ExhibitContentForm

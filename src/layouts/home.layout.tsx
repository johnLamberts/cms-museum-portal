import { useBlockEditor } from "@/modules/admin/page-editor/home-editor/hooks/useHomeEditor";
import useViewHomeEditor from "@/modules/admin/page-editor/home-editor/hooks/useViewHomeEditor";
import { EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import "../styles/partials/index.css";

const HomeLayout = () => {
  const {isLoading, homeView} = useViewHomeEditor();
  

  const { editor } = useBlockEditor();

  useEffect(() => {
    if (editor && homeView?.homeContent) {
      editor.commands.setContent(homeView.homeContent)
      editor.setEditable(false);
    }
  }, [editor, homeView?.homeContent])

  if (isLoading) return <div>Loading...</div>


  return (
   <div className="pt-10">

    {/* Landing page */}
    {/* <Hero />
    <About />
   

    <hr className="text-neutral-300" />

    <UpcomingEvents />

    <Highlights /> */}

  {/* <div className="prose max-w-none mx-auto pt-12" dangerouslySetInnerHTML={{ __html: homeView.homeContent }} /> */}
    {editor && <EditorContent editor={editor} />}
   </div>
  )
}

export default HomeLayout

import { useBlockEditor } from "@/modules/admin/page-editor/home-editor/hooks/useHomeEditor";
import useViewHomeEditor from "@/modules/admin/page-editor/home-editor/hooks/useViewHomeEditor";
import About from "@/modules/landing-page/about.page";
import Hero from "@/modules/landing-page/hero.page";
import Highlights from "@/modules/landing-page/highlights.page";
import UpcomingEvents from "@/modules/landing-page/upcoming-events.page";
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
    <Hero />
    <About />
   

    <hr className="text-neutral-300" />

    <UpcomingEvents />

    <Highlights />

  {/* <div className="prose max-w-none mx-auto pt-12" dangerouslySetInnerHTML={{ __html: homeView.homeContent }} /> */}
    {/* {editor && <EditorContent editor={editor} />} */}
   
      {/* <Preview content={homeView?.homeContent} /> */}
   </div>
  )
}

export default HomeLayout

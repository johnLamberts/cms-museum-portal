import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import HomeForm from "./home-form";
import useCreateHomeEditor from "./hooks/useCreateHomeEditor";
import useViewHomeEditor from "./hooks/useViewHomeEditor";

export type HomeFormData = {

  home_id?: string;

  homeContent?: string;

  updated_at?: string;
  
  created_at?: string;

  mode?: string;



}


const HomeContent = () => {

  const navigate = useNavigate();
  const form = useForm<HomeFormData>();

  const { isAddingHomeEditor, addHomeHandler } = useCreateHomeEditor();


  const { homeView } = useViewHomeEditor();

  console.log(homeView);

  const onSubmit = async (data: HomeFormData) => {

    try {

     
      await addHomeHandler(data)

      console.log(data)
     
      // console.log(form.getValues())
       
      // navigate("/admin-dashboard/events")
      
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 

  }

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1 ">
      <Toolbar.Button disabled={isAddingHomeEditor}  onClick={() => navigate("/admin-dashboard/museums")}>
        Back
      </Toolbar.Button>
      <Toolbar.Button disabled={isAddingHomeEditor}  type="submit" className="bg-[#927B6B]/95 text-white" onClick={form.handleSubmit(onSubmit)}>
        Save
      </Toolbar.Button>
    </Surface>,
    document.body
  )
  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        {actionButtons}
        <HomeForm form={form} />
      </div>
    </>
  )
}

export default HomeContent

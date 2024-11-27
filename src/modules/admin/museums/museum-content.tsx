import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useCreateMuseum from "./hooks/useCreateMuseum";
import MuseumForm from "./musuem-form";

export type MuseumFormData = {
  title: string
  coverPhoto: string
  description: string
  colorTheme: string
  museumContent: string
}


const MuseumContent = () => {

  const navigate = useNavigate();
  const form = useForm<MuseumFormData>();

  const { isAddingMuseum, addMuseumHandler} = useCreateMuseum();


   
  const onSubmit = async (data: MuseumFormData) => {
    try {

     
      await addMuseumHandler(data)
     
      console.log(form.getValues())
       
      navigate("/admin-dashboard/museums")
      
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 

  }

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1 ">
      <Toolbar.Button disabled={isAddingMuseum}  onClick={() => navigate("/admin-dashboard/museums")}>
        Back
      </Toolbar.Button>
      <Toolbar.Button disabled={isAddingMuseum}  type="submit" className="bg-[#927B6B]/95 text-white" onClick={form.handleSubmit(onSubmit)}>
        Save
      </Toolbar.Button>
    </Surface>,
    document.body
  )
  return (
    <>
      <div className="flex flex-col h-screen">
        {actionButtons}
        <MuseumForm form={form} />
      </div>
    </>
  )
}

export default MuseumContent

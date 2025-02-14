import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import EventForm from "./event-form";
import useCreateEvent from "./hooks/useCreateEvent";

export type EventFormData = {

  title: string

  coverPhoto: File



  
  eventContent: string



}


const EventContent = () => {

  const navigate = useNavigate();
  const form = useForm<EventFormData>();

  const { isAddingEvent, addEventHandler} = useCreateEvent();


   
  const onSubmit = async (data: EventFormData) => {
    try {

     
      await addEventHandler(data)

     
      console.log(form.getValues())
       
      // navigate("/admin-dashboard/events")
      
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 

  }

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1 ">
      <Toolbar.Button disabled={isAddingEvent}  onClick={() => navigate("/admin-dashboard/museums")}>
        Back
      </Toolbar.Button>
      <Toolbar.Button disabled={isAddingEvent}  type="submit" className="bg-[#927B6B]/95 text-white" onClick={form.handleSubmit(onSubmit)}>
        Save
      </Toolbar.Button>
    </Surface>,
    document.body
  )
  return (
    <>
      <div className="flex flex-col h-screen">
        {actionButtons}
        <EventForm form={form} />
      </div>
    </>
  )
}

export default EventContent

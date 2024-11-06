import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ExhibitContentForm from "./exhibit-form.content";

const MuseumContent = () => {

  const navigate = useNavigate();

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1 ">
      <Toolbar.Button onClick={() => navigate("/admin-dashboard/exhibit_mgm")}>
        Back
      </Toolbar.Button>
      <Toolbar.Button className="bg-[#927B6B]/95 text-white">
        Save
      </Toolbar.Button>
    </Surface>,
    document.body
  )
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {actionButtons}
        <ExhibitContentForm />
      </div>
    </>
  )
}

export default MuseumContent

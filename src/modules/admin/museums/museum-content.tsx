 
import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import "@/styles/museums/index.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MuseumLoader from "./exhibit-loader";
import useCreateMuseum from "./hooks/useCreateMuseum";
import { useExhibit } from "./hooks/useMuseums";
import useUpdateExhibit from "./hooks/useUpdateExhibit";
import MuseumForm from "./musuem-form";

export type MuseumFormData = {
  title: string;
  coverPhoto: string;
  colorTheme: string;
  museumContent: string;
  address?: string;
  fee?: string; 

};

const defaultValues = {
  title: "",
  coverPhoto: "",
  colorTheme: "",
  museumContent: "",
  address: "",
  fee: ""

};

const MuseumContent = () => {
  const navigate = useNavigate();
  const { data: exhibit, isLoading } = useExhibit();
  const { isAddingMuseum, addMuseumHandler } = useCreateMuseum();
  const { isUpdatingExhibit, updateExhibitHandler } = useUpdateExhibit();

  // Safely destructure exhibit
  const { exhibits_id, ...otherData } = exhibit || {};

  const isEditingMode = Boolean(exhibits_id);

  const form = useForm<MuseumFormData>({
    defaultValues: isEditingMode && exhibit ? { ...otherData } : defaultValues,
  });

  useEffect(() => {
    if (isEditingMode && exhibit) {
      const exhibitData = {
        title: otherData.title || "",
        coverPhoto: otherData.coverPhoto || "",
        colorTheme: otherData.colorTheme || "",
        museumContent: otherData.museumContent || "",
        address: otherData.address || "",
        fee: otherData.fee || "",
      };
      form.reset(exhibitData);
      console.log("Form reset with:", exhibitData);
    }
  }, [exhibit, isEditingMode, form]);

  const onSubmit = async (data: MuseumFormData) => {
    try {
      if (isEditingMode) {
        await updateExhibitHandler({
          ...data,
          exhibits_id
        });
      } else {
        await addMuseumHandler(data);
      }
      navigate("/admin-dashboard/museums");
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
    }
  };

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingExhibit : isAddingMuseum}
        onClick={() => navigate("/admin-dashboard/museums")}
      >
        Back
      </Toolbar.Button>
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingExhibit : isAddingMuseum}
        type="submit"
        className="bg-[#927B6B]/95 text-white"
        onClick={form.handleSubmit(onSubmit)}
      >
        {isEditingMode ? "Update" : "Save"}
      </Toolbar.Button>
    </Surface>,
    document.body
  );

  if (isLoading) return <MuseumLoader />;

  return (
    <div className="flex flex-col h-screen">
      {actionButtons}
      <MuseumForm form={form} isEditingMode={isEditingMode} exhibit={exhibit} />
    </div>
  );
};

export default MuseumContent;

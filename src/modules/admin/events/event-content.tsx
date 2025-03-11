/* eslint-disable @typescript-eslint/no-explicit-any */
import { Surface } from "@/components/surface";
import { Toolbar } from "@/components/ui/toolbar";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MuseumLoader from "../museums/exhibit-loader";
import { useBlockEditor } from "../museums/hooks/useMuseumEditor";
import EventForm from "./event-form";
import useCreateEvent from "./hooks/useCreateEvent";
import { useEvent } from "./hooks/useEvents";
import useUpdateEvent from "./hooks/useUpdateEvent";

export type EventFormData = {
  title: string;
  coverPhoto: string;
  status?: string;
  eventDate?: string;
  eventTime?: string;
  eventContent?: string | any;
};

const defaultValues = {
  title: "",
  coverPhoto: "",
  status: "",
  eventDate: "",
  eventTime: "",
  eventContent: "",
};

const EventContent = () => {
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent();
  const { isAddingEvent, addEventHandler } = useCreateEvent();
  const { isUpdatingEvent, updateEventHandler } = useUpdateEvent();

  const contentSetupComplete = useRef(false);

  const { event_id, ...otherData } = event || {};
  const isEditingMode = Boolean(event_id);


  const { editor, setContent } = useBlockEditor();

  const form = useForm<EventFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (isEditingMode && event && editor && !contentSetupComplete.current) {
      console.log("SETUP: All conditions met for content synchronization");
      console.log("SETUP: Event content to load:", otherData.eventContent);

      const eventData = {
        title: otherData.title || "",
        coverPhoto: otherData.coverPhoto || "",
        status: otherData.status || "",
        eventDate: otherData.eventDate || "",
        eventTime: otherData.eventTime || "",
        eventContent: otherData.eventContent || "",
      };

      form.reset(eventData);

      if (eventData.eventContent) {
        try {
          const success = setContent(eventData.eventContent);
          console.log("SETUP: Editor setContent result:", success);

          if (!success && editor) {
            try {
              editor.commands.setContent(eventData.eventContent);
              console.log("SETUP: Successfully set content using editor commands");
            } catch (err) {
              console.error("SETUP: Failed to set editor content:", err);
            }
          }
        } catch (err) {
          console.error("SETUP: Error setting content:", err);
        }
      }

      contentSetupComplete.current = true;
    }
  }, [isEditingMode, event, editor, otherData, form, setContent]);

  useEffect(() => {
    if (editor) {
      const updateFormContent = () => {
        const html = editor.getJSON();
        form.setValue("eventContent", html, { shouldDirty: true });
      };

      editor.on("update", updateFormContent);
      return () => {
        editor.off("update", updateFormContent);
      };
    }
  }, [editor, form]);

  const onSubmit = async (data: EventFormData) => {
    const editorContent = editor ? editor.getJSON() : data.eventContent;
    const updatedData = {
      ...data,
      eventContent: editorContent,
    };

    console.log("SUBMIT: Form data", data);
    console.log("SUBMIT: Editor content length", editorContent.length);

    try {
      if (isEditingMode) {
        await updateEventHandler({
          ...updatedData,
          event_id,
        });
      } else {
        await addEventHandler(updatedData);
      }
      navigate("/admin-dashboard/events");
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
    }
  };

  const actionButtons = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingEvent : isAddingEvent}
        onClick={() => navigate("/admin-dashboard/events")}
      >
        Back
      </Toolbar.Button>
      <Toolbar.Button
        disabled={isEditingMode ? isUpdatingEvent : isAddingEvent}
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
      {isEditingMode && (
        <div className="fixed top-0 left-0 bg-black/70 text-white p-2 text-xs z-[999999]">
          Editing Mode: {isEditingMode ? "Yes" : "No"} | Event ID: {event_id} |
          Editor Ready: {editor ? "Yes" : "No"} | Content Set:{" "}
          {contentSetupComplete.current ? "Yes" : "No"}
        </div>
      )}

      {actionButtons}
      <EventForm editor={editor} form={form} isEditingMode={isEditingMode} event={event} />
    </div>
  );
};

export default EventContent;

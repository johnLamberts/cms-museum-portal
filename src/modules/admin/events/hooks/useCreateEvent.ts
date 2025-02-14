import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import eventService from "../service/event.service";


export default function useCreateEvent() {
    const queryClient = useQueryClient();
  
    const { isPending: isAddingEvent, mutateAsync: addEventHandler } = useMutation({
      mutationFn: eventService.addEvent,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).title} has been created successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_MUSEUMS_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isAddingEvent, addEventHandler}
  
}

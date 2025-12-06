import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import eventService from "../service/event.service";

export default function useUpdateEvent() {
  const queryClient = useQueryClient();

  const { isPending: isUpdatingEvent, mutateAsync: updateEventHandler } = useMutation({
    mutationFn: eventService.updateEvent,
    onSuccess: (_newArr, data) => {
      toast.success(
        `Success! The ${(data).title} has been created successfully. `
      );
      queryClient.invalidateQueries({
        queryKey: [CMS_KEYZ.READ_CREATE_EVENTS_ADDED],
      });

      queryClient.refetchQueries({ queryKey: [CMS_KEYZ.READ_CREATE_EVENTS_ADDED] });
    },
    onError: (err) => toast.error(err.message),

  }) 

  return { isUpdatingEvent, updateEventHandler }

}

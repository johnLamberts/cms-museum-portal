import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import baranggayService from "../services/exhibition.service";

export default function useCreateBaranggay() {
  const queryClient = useQueryClient();

  const { isPending: isAddingBaranggay, mutateAsync: addBaranggayHandler } = useMutation({
    mutationFn: baranggayService.addExhibitionHandler,
    onSuccess: (_newArr, data) => {
      toast.success(
        `Success! The ${(data).exhibition_type} has been created successfully. `
      );
      queryClient.invalidateQueries({
        queryKey: [CMS_KEYZ.EXHIBITION],
      });
    },
    onError: (err) => toast.error(err.message),

  }) 

  return { isAddingBaranggay, addBaranggayHandler}

}

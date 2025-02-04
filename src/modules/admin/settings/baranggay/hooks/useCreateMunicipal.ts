import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import baranggayService from "../services/baranggay.service";

export default function useCreateBaranggay() {
  const queryClient = useQueryClient();

  const { isPending: isAddingBaranggay, mutateAsync: addBaranggayHandler } = useMutation({
    mutationFn: baranggayService.addBaranggayHandler,
    onSuccess: (_newArr, data) => {
      toast.success(
        `Success! The ${(data).baranggay} has been created successfully. `
      );
      queryClient.invalidateQueries({
        queryKey: [CMS_KEYZ.BARANGGAY],
      });
    },
    onError: (err) => toast.error(err.message),

  }) 

  return { isAddingBaranggay, addBaranggayHandler}

}

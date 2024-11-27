import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import museumService from "../services/museum.service";


export default function useCreateMuseum() {
    const queryClient = useQueryClient();
  
    const { isPending: isAddingMuseum, mutateAsync: addMuseumHandler } = useMutation({
      mutationFn: museumService.addMuseum,
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
  
    return { isAddingMuseum, addMuseumHandler}
  
}

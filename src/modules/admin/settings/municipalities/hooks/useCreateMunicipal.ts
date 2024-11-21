import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import municipalService from "../services/municipal.service";

export default function useCreateMunicipal() {
  const queryClient = useQueryClient();

  const { isPending: isAddingMunicipal, mutateAsync: addMunicipalHandler } = useMutation({
    mutationFn: municipalService.addMunicipalHandler,
    onSuccess: (_newArr, data) => {
      toast.success(
        `Success! The ${(data).municipal} has been created successfully. `
      );
      queryClient.invalidateQueries({
        queryKey: [CMS_KEYZ.MUNICIPALITY],
      });
    },
    onError: (err) => toast.error(err.message),

  }) 

  return { isAddingMunicipal, addMunicipalHandler}

}

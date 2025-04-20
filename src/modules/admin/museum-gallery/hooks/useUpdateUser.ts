import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import artifactService from "../service/artifact.service";


export default function useUpdateArtifacts() {
    const queryClient = useQueryClient();
  
    const { isPending: isModifyingArtifact, mutateAsync: updateArtifactHandler } = useMutation({
      mutationFn: artifactService.updateArtifact,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).email} has been modified successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_GALLERY_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isModifyingArtifact, updateArtifactHandler }
  
}

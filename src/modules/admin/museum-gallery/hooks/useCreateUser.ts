import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import artifactService from "../service/artifact.service";


export default function useCreateArtifacts() {
    const queryClient = useQueryClient();
  
    const { isPending: isAddingArtifact, mutateAsync: addArtifactHandler } = useMutation({
      mutationFn: artifactService.addArtifact,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).title} has been created successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_GALLERY_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isAddingArtifact, addArtifactHandler }
  
}

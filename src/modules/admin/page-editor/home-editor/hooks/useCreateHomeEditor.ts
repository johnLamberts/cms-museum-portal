import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import homeEditorService from "../service/home-editor.service";


export default function useCreateHomeEditor() {
    const queryClient = useQueryClient();
  
    const { isPending: isAddingHomeEditor, mutateAsync: addHomeHandler  } = useMutation({
      mutationFn: homeEditorService.addHomeEdits,
      onSuccess: () => {
        toast.success(
          `Success! Home Page has been modified successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_WRITE_HOME_EDITOR],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isAddingHomeEditor, addHomeHandler }
  
}

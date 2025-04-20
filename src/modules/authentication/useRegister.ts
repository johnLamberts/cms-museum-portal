import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import authService from "./auth.service";

export default function useRegisterVisitor() {
  const queryClient = useQueryClient();

  const { isPending: isAddingVisitor, mutateAsync: registerVisitorHandler } = useMutation({
    mutationFn: authService.registerVisitor,
    onSuccess: (_newArr, data) => {
      toast.success(
        `Success! The ${(data).email} has been created successfully. `
      );
      queryClient.invalidateQueries({
        queryKey: [CMS_KEYZ.REGISTER_VISITOR
        ],
      });
    },
    onError: (err) => toast.error(err.message),

  }) 

  return { isAddingVisitor, registerVisitorHandler}

}

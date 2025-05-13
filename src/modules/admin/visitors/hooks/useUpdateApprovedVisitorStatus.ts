import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import visitorService from "../service/visitor.service";

export default function useUpdateVisitorApprovedStatus() {
    const queryClient = useQueryClient();
  
    const { isPending: isModifyVisitorApprovalStatus, mutateAsync: updateVisitorStatusApprovalHandler } = useMutation({
      mutationFn: visitorService.updateApprovedVisitorStatus,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).email} has been modified successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_VISITORS_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isModifyVisitorApprovalStatus, updateVisitorStatusApprovalHandler}
  
}

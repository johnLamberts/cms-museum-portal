import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import userService from "../service/user.service";


export default function useUpdateUser() {
    const queryClient = useQueryClient();
  
    const { isPending: isModifyingUser, mutateAsync: updateUserHandler } = useMutation({
      mutationFn: userService.updateUser,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).email} has been modified successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_USERS_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isModifyingUser, updateUserHandler}
  
}

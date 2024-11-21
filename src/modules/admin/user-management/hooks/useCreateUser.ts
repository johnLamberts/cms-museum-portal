import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import userService from "../service/user.service";


export default function useCreateUser() {
    const queryClient = useQueryClient();
  
    const { isPending: isAddingUser, mutateAsync: addUserHandler } = useMutation({
      mutationFn: userService.addUser,
      onSuccess: (_newArr, data) => {
        toast.success(
          `Success! The ${(data).email} has been created successfully. `
        );
        queryClient.invalidateQueries({
          queryKey: [CMS_KEYZ.READ_CREATE_USERS_ADDED],
        });
      },
      onError: (err) => toast.error(err.message),
  
    }) 
  
    return { isAddingUser, addUserHandler}
  
}

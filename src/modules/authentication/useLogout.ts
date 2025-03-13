import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "./auth.service";

const useLogout = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: logoutUser } = useMutation({
    mutationFn: authService.logoutUserHandler,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      toast.success(
        "Thank you for using our portal! You're now being logged out. If you need assistance in the future, don't hesitate to reach out. Have a great day!"
      );
    },
  });

  return { logoutUser };
};
export default useLogout;

/* eslint-disable @typescript-eslint/no-explicit-any */
import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authService from "./auth.service";

export default function useLogin() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    mutate: loginUser,
     isPending
  } = useMutation({
    mutationFn: ({ email, password}: any) => authService.loginHandler({ email, password}),

    onSuccess: (user) => {
      queryClient.setQueryData(
        [CMS_KEYZ.CURRENT_USER], user
      );

      console.log(user);

      if(user?.userRole === "admin") navigate("/admin-dashboard");

      if(user?.userRole === "visitor") navigate("/visitor");

    }
  })

  return { loginUser, isPending};
}

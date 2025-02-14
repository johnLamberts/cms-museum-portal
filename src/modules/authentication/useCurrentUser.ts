import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import authService from "./auth.service";

const useCurrentUser = () => {
  const { isLoading, data: user } = useQuery({
    queryKey: [CMS_KEYZ.CURRENT_USER],
    queryFn: authService.currentUserHandler,
    refetchOnWindowFocus: false,
  });

  return { isLoading, user };
};
export default useCurrentUser;

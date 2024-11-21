import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import userService from "../service/user.service";

const useUsers = () => {
  return useQuery({
    queryFn: userService.getAllUsers,
    queryKey: [CMS_KEYZ.READ_CREATE_USERS_ADDED],

    refetchOnWindowFocus: false,
  });
}

export default useUsers

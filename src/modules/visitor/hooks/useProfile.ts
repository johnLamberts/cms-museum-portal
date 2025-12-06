/* eslint-disable @typescript-eslint/no-explicit-any */
import CMS_KEYZ from "@/lib/enum";
import useCurrentUser from "@/modules/authentication/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import profileService from "../service/profile.service";

export default function useProfilePosts() {

  const { user } = useCurrentUser();
  
  return useQuery({
    queryFn: () => profileService.getUserPosts((user as any).user_uid),
    queryKey: [CMS_KEYZ.CURRENT_USER_POSTS],

    refetchOnWindowFocus: false,
  }); 
}

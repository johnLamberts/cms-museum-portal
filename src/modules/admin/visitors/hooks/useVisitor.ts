import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import visitorService from "../service/visitor.service";

const useVisitors = () => {
  return useQuery({
    queryFn: visitorService.getAllVisitors,
    queryKey: [CMS_KEYZ.READ_CREATE_VISITORS_ADDED],

    refetchOnWindowFocus: false,
  });
}

export default useVisitors

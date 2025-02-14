import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import featuredService from "../service/featured.service";

const useFeaturedEvents = () => {
  return useQuery({
    queryFn: featuredService.featuredEvents,
    queryKey: [CMS_KEYZ.LATEST_FEATURED_EVENTS],

    refetchOnWindowFocus: false,
  });
}

export default useFeaturedEvents

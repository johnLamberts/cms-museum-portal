 
import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import featuredService from "../service/featured.service";

const useFeaturedEventById = () => {

  const { evid } = useParams();

  return useQuery({
    queryFn: () => featuredService.getFeaturedEventById(evid),
    queryKey: [CMS_KEYZ.GET_LATEST_FEATURED_EVENTS_BY_ID, evid],
    refetchOnWindowFocus: false,
  });
}

export default useFeaturedEventById

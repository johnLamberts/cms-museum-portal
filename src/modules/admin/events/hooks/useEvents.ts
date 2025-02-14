import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import eventService from "../service/event.service";

const useEvents = () => {
  return useQuery({
    queryFn: eventService.getAllEvents,
    queryKey: [CMS_KEYZ.READ_CREATE_EVENTS_ADDED],

    refetchOnWindowFocus: false,
  });
}

export default useEvents

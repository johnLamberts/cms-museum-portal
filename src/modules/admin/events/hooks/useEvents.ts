import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import eventService from "../service/event.service";

const useEvents = () => {
  return useQuery({
    queryFn: eventService.getAllEvents,
    queryKey: [CMS_KEYZ.READ_CREATE_EVENTS_ADDED],

    refetchOnWindowFocus: false,
  });
}

const useEvent = () => {

  const { eventsId } = useParams();
  return useQuery({
    queryKey: [CMS_KEYZ.READ_CREATE_EVENTS_ADDED, eventsId],
    queryFn: () => eventService.getEventById(eventsId as string),
    enabled: !!eventsId,
    refetchOnWindowFocus: false,
  });
}

export { useEvent, useEvents };


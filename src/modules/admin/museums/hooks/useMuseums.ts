 
import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import museumService from "../services/museum.service";

 const useMuseums = () => {
  return useQuery({
    queryFn: museumService.getAllMuseums,
    queryKey: [CMS_KEYZ.READ_CREATE_MUSEUMS_ADDED],

    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

 const useExhibit = () => {

  const { exhibitId } = useParams();

  return useQuery({
    queryKey: [CMS_KEYZ.READ_CREATE_MUSEUMS_ADDED, exhibitId],
    queryFn: () => museumService.getExhibit(exhibitId as string),
    enabled: !!exhibitId,
    refetchOnWindowFocus: false,
  });
}

export { useExhibit, useMuseums };


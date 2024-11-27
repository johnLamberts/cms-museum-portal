import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import museumService from "../services/museum.service";

const useMuseums = () => {
  return useQuery({
    queryFn: museumService.getAllMuseums,
    queryKey: [CMS_KEYZ.READ_CREATE_MUSEUMS_ADDED],

    refetchOnWindowFocus: false,
  });
}

export default useMuseums

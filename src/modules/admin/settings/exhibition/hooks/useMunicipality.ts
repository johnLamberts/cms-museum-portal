import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import baranggayService from "../services/exhibition.service";

const useBaranggay = () => {
  
  return useQuery({
    queryFn: baranggayService.getBaranggayHandler,
    queryKey: [CMS_KEYZ.EXHIBITION],

    refetchOnWindowFocus: false,
  });
}

export default useBaranggay

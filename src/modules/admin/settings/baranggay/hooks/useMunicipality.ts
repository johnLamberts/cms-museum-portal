import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import baranggayService from "../services/baranggay.service";

const useBaranggay = () => {
  
  return useQuery({
    queryFn: baranggayService.getBaranggayHandler,
    queryKey: [CMS_KEYZ.BARANGGAY],

    refetchOnWindowFocus: false,
  });
}

export default useBaranggay

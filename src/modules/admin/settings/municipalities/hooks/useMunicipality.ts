import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import municipalService from "../services/municipal.service";

const useMunicipalities = () => {
  
  return useQuery({
    queryFn: municipalService.getMunicipalityHandler,
    queryKey: [CMS_KEYZ.MUNICIPALITY],

    refetchOnWindowFocus: false,
  });
}

export default useMunicipalities

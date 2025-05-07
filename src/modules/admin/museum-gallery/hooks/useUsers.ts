import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import artifactService from "../service/artifact.service";

const useArtifacts = () => {
  return useQuery({
    queryFn: artifactService.getAllArtifacts,
    queryKey: [CMS_KEYZ.READ_CREATE_GALLERY_ADDED],

    refetchOnWindowFocus: false,
  });
}

export default useArtifacts

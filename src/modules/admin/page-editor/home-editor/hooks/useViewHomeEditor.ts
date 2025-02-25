import CMS_KEYZ from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import homeEditorService from "../service/home-editor.service";

const useViewHomeEditor = () => {
  const { isLoading, data: homeView } = useQuery({
    queryKey: [CMS_KEYZ.HOME_EDITOR_PAGE],
    queryFn: homeEditorService.getHomePage,
    refetchOnWindowFocus: false,
  });

  return { isLoading, homeView };
};
export default useViewHomeEditor;

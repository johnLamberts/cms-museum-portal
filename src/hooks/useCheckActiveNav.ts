import { useLocation } from "react-router-dom";

const useCheckActiveNav = () => {
  const { pathname } = useLocation();

  const checkActiveNav = (nav: string) => {
    const pathArr = pathname.split("/").filter((item) => item !== "");

    if (nav === "/" && pathArr.length < 1) return true;

    return pathArr.includes(nav.replace(/^\//, ""));
  };
  return { checkActiveNav };
};
export default useCheckActiveNav;

import supabase from "@/lib/supabase";
import axios from "axios";
import { HomeFormData } from "../home-content";

export default {
  /**-------------------------------------------------- */
  // Create Home Editor                                         |
  /**-------------------------------------------------- */
  addHomeEdits: async (payload: HomeFormData) => {
    try {


    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_SERVER_URL}/api/v1/home_edits/add_home_editor`,
      data: payload,
    });

    return response.data

    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },

   /**-------------------------------------------------- */
   // Get Museum                                            |
   /**-------------------------------------------------- */
    getHomePage: async () => {
    try{
      // const response = await axios({
      //   method: "GET",
      //   url: `${import.meta.env.VITE_SERVER_URL}/api/v1/home_edits/`,
      // });

      // return response.data;

      const { data, error } = await supabase.from("home_editor").select("*").single();

      console.log(data)
      if(error) throw Error(JSON.stringify(error, null, 2));

      return data;

    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },
}

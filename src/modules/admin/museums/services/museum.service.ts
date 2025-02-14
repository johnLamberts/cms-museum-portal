import axios from "axios";
import { MuseumFormData } from "../museum-content";

export default {
  /**-------------------------------------------------- */
  // Create Museum                                         |
  /**-------------------------------------------------- */
  addMuseum: async (payload: MuseumFormData) => {
    try {


      console.log(payload)
    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_SERVER_URL}/api/v1/exhibit/add_exhibit`,
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
    getAllMuseums: async () => {
    try{
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/exhibit/`,
      });

      return response.data;
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },
}

import axios from "axios";
import * as z from "zod";
import IBaranggay from "../baranggay.interface";

export default {
  addBaranggayHandler: async (payload: IBaranggay): Promise<IBaranggay> => {
    try {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/baranggay/add_baranggay`,
        data: {
          ...payload
        },
      });
  
      return response.data;
  
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        console.error("Validation error:", err.errors);
        throw new Error("Invalid form data");
      } else if (axios.isAxiosError(err)) {
        console.error(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", err);
        throw new Error("An unexpected error occurred");
      }
    }
  },

  getBaranggayHandler: async () => {
    try{
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/baranggay/`,
      });

      return response.data;

    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  }
}

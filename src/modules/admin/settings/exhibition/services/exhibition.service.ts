import supabase from "@/lib/supabase";
import axios from "axios";
import * as z from "zod";
import IExhibition from "../exhibition.interface";

export default {
  addExhibitionHandler: async (payload: IExhibition): Promise<IExhibition> => {
    try {
      const { data: exhibition, error: exhibitionErr } = await supabase
      .from("exhibition_type")
      .insert({
        ...payload
      })
      .select()
      .single();
  
      if(exhibitionErr) throw  `[BaranggayErrorService]: ${JSON.stringify(exhibitionErr, null, 0)}`;
  
  
  
      return exhibition;
  
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
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/exhibition/`,
      });


      console.log(response.data)
      return response.data;

    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  }
}

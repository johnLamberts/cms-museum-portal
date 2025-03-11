/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";
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
   // Get Museums                                       |
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

   /**-------------------------------------------------- */
   // Get Exhibit                                            |
   /**-------------------------------------------------- */
   getExhibit: async (payloadId: string) => {
    try{
      
      const { data, error } = await supabase.from("exhibits")
        .select("*")
        .eq("exhibits_id", payloadId)
        .single();

        if(error) return `[ExhibitErrorService]: ${JSON.stringify(error, null, 0)}`;

        return data; 
        
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },

  /**-------------------------------------------------- */
   // Update Exhibit                                            |
   /**-------------------------------------------------- */
  async updateExhibit (payload: any) {

    
    const { data: exhibit, error: exhibitUpdatingError } = await supabase
    .from("exhibits")
    .update({
      ...payload
    })
    .eq("exhibits_id", payload.exhibits_id)
    .single();

    if(exhibitUpdatingError) throw  `[UpdatingExhibitErrorService]: ${JSON.stringify(exhibitUpdatingError, null, 0)}`;


    return exhibit;
  }
}

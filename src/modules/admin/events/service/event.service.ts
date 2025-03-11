/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";
import axios from "axios";
import { EventFormData } from "../event-content";

export default {
  /**-------------------------------------------------- */
  // Create Event                                         |
  /**-------------------------------------------------- */
  addEvent: async (payload: EventFormData) => {
    try {

      console.log(payload);
      
      const { data: event, error: eventError } = await supabase
      .from("events")
      .insert(payload)
      .select()
      .single();
  
      if(eventError) throw  `[EventErrorService]: ${JSON.stringify(eventError, null, 0)}`;
  
      return event;
      
      // const formData = new FormData();
      // Object.entries(payload).forEach(([key, value]) => {
      //   if (key === 'coverPhoto' && value instanceof File) {
      //     formData.append('coverPhoto', value);
      //   } else if (value !== undefined) {
      //     formData.append(key, value.toString());
      //   }
      // });
  
  
      // const response = await axios({
      //   method: "POST",
      //   url: `${import.meta.env.VITE_SERVER_URL}/api/v1/event/add_event`,
      //   data: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
  
      // return response.data


    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },

   /**-------------------------------------------------- */
   // Get Event                                            |
   /**-------------------------------------------------- */
    getAllEvents: async () => {
    try{
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/event/`,
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
     getEvent: async (payloadId: string) => {
      try{
        
        const { data, error } = await supabase.from("events")
          .select("*")
          .eq("event_id", payloadId)
          .single();
  
          if(error) return `[EventErrorService]: ${JSON.stringify(error, null, 0)}`;
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
    async updateEvent (payload: any) {
  
      
      const { data: exhibit, error: exhibitUpdatingError } = await supabase
      .from("events")
      .update({
        ...payload
      })
      .eq("event_id", payload.event_id)
      .single();
  
      if(exhibitUpdatingError) throw  `[UpdatingEventErrorService]: ${JSON.stringify(exhibitUpdatingError, null, 0)}`;
  
  
      return exhibit;
    }
}

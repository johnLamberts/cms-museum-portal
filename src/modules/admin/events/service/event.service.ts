import axios from "axios";
import { EventFormData } from "../event-content";

export default {
  /**-------------------------------------------------- */
  // Create Event                                         |
  /**-------------------------------------------------- */
  addEvent: async (payload: EventFormData) => {
    try {

      console.log(payload);
      
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'coverPhoto' && value instanceof File) {
          formData.append('coverPhoto', value);
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      // Log the FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/event/add_event`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
}

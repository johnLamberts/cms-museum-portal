import axios from "axios";
import IAuthClient from "./auth.interface";

export default {
  /**-------------------------------------------------- */
  // Login User                                         |
  /**-------------------------------------------------- */
  loginHandler: async (payload: IAuthClient) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
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

   
}

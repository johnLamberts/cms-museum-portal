import supabase from "@/lib/supabase";
import axios from "axios";
import IAuthClient from "./auth.interface";

export default {
  /**-------------------------------------------------- */
  // Login User                                         |
  /**-------------------------------------------------- */
  loginHandler: async (payload: IAuthClient) => {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      })
  
  
      if(authError) throw `[AuthErrorService]: ${JSON.stringify(authError, null, 0)}`;
  
      console.log(data.user)
      return data.user.user_metadata;

    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },
  
   /**-------------------------------------------------- */
  // Current User                                         |
  /**-------------------------------------------------- */
  currentUserHandler: async () => {
    try {
     const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching current user:', error.message);
        return null;
      }
    
      return user;
      
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },

   
}

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
      });
  
      // If Supabase returns an auth error
      if (authError) {
        // Format the error message to be more user-friendly
        const errorMessage = authError.message || "Authentication failed";
        throw new Error(errorMessage);
      }
  
      // Check if user data exists
      if (!data?.user?.user_metadata) {
        throw new Error("User data not found");
      }
  
      return data.user.user_metadata;
    } catch (err) {
      // Handle different error types
      if (err instanceof axios.AxiosError) {
        const errorMessage = err.response?.data?.error || "Server error";
        throw new Error(errorMessage);
      }
      
      // Re-throw the error so it can be caught by the mutation
      throw err;
    }
  },
  
  /**-------------------------------------------------- */
  // Current User                                         |
  /**-------------------------------------------------- */
  currentUserHandler: async () => {
    try {

    const { data: session } = await supabase.auth.getSession();

    if (!session.session) return null;

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

  /**-------------------------------------------------- */
  // Logout Current User                                         |
  /**-------------------------------------------------- */
  logoutUserHandler: async () => {
    try {

     const { error } = await supabase.auth.signOut();
      
      if(error) throw `${JSON.stringify(error,  null, 2)}`
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error);
        throw new Error(`${err.response?.data.error}`);
      }
    }
  },
   
}

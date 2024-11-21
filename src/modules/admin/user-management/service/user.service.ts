import axios from "axios";
import { UserFormValues } from "../user-content.form";

export default {
  /**-------------------------------------------------- */
  // Create User                                         |
  /**-------------------------------------------------- */
  addUser: async (payload: Omit<UserFormValues, "userLocation">) => {
    try {
      const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'userImg' && value instanceof File) {
        formData.append('userImg', value);
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
      url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/add_user`,
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
   // Get User                                            |
   /**-------------------------------------------------- */
    getAllUsers: async () => {
    try{
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/`,
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

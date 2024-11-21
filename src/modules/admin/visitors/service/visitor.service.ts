import axios from "axios";

export default {
  /**-------------------------------------------------- */
  // Create Visitor                                         |
  /**-------------------------------------------------- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addVisitor: async (payload: any) => {
    try {
      const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'visitorImg' && value instanceof File) {
        formData.append('visitorImg', value);
      } else if (value !== undefined) {
        formData.append(key, value!.toString());
      }
    });

    // Log the FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_SERVER_URL}/api/v1/visitor/add_visitor`,
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
   // Get Visitor                                            |
   /**-------------------------------------------------- */
    getAllVisitors: async () => {
    try{
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/visitor/`,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
// import { ArtifactFormValues } from "../gallery-content.form";

export default {
  /**-------------------------------------------------- */
  // Create Artifact                                     |
  /**-------------------------------------------------- */
  addArtifact: async (payload: any) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'artifactImg' && value instanceof File) {
          formData.append('artifactImg', value);
        } else if (value !== undefined) {
          formData.append(key, value!.toString());
        }
      });
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/artifacts/add_artifact`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
  // Update Artifact                                     |
  /**-------------------------------------------------- */
  updateArtifact: async (payload: any) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'artifactImg' && value instanceof File) {
          formData.append('artifactImg', value);
        } else if (value !== undefined) {
          formData.append(key, value!.toString());
        }
      });

      const response = await axios({
        method: "PUT",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/artifacts/update_artifact`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
  // Get Artifacts                                      |
  /**-------------------------------------------------- */
  getAllArtifacts: async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/artifacts/`,
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
  // Delete Artifact                                    |
  /**-------------------------------------------------- */
  deleteArtifact: async (artifactId: string) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/artifacts/delete_artifact/${artifactId}`,
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

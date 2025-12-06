/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";
import { HomeFormData } from "../home-content";

export default {
  /**-------------------------------------------------- */
  // Create Home Editor                                         |
  /**-------------------------------------------------- */
  addHomeEdits: async (payload: any) => {
    try {
      console.log("Saving home content with payload:", payload);
      
      // First check if any records exist at all
      const { data: existingRecords, error: countError } = await supabase
        .from("home_editor")
        .select("home_id")
        .limit(1);
      
      if (countError) {
        console.error("Error checking existing records:", countError);
        throw Error(countError.message);
      }
      
      // Prepare the content - ensure it's a string if it's an object
      let contentToStore = payload.homeContent;
      if (typeof contentToStore === 'object' && contentToStore !== null) {
        contentToStore = JSON.stringify(contentToStore);
      }
      
      // Prepare data for storage
      const dataToStore = {
        home_id: payload.home_id || "home-page", // Provide a default if none exists
        homeContent: contentToStore,
        title: payload?.meta?.title || payload.title || 'Home Page',
        description: payload?.meta?.description || payload.description || '',
        keywords: payload?.meta?.keywords || payload.keywords || '',
        updated_at: new Date().toISOString()
      };
      
      console.log("Data being sent to Supabase:", dataToStore);

      // If records exist, do an update, otherwise insert
      if (existingRecords && existingRecords.length > 0) {
        console.log("Updating existing home content");
        const { data: updatedData, error: updateError } = await supabase
          .from("home_editor")
          .update(dataToStore)
          .eq("home_id", dataToStore.home_id)
          .select("*")
          .single();

        if (updateError) {
          console.error("Error updating record:", updateError);
          throw updateError;
        }
        
        console.log("Update successful:", updatedData);
        return updatedData;
      } else {
        console.log("Creating new home content");
        // dataToStore.created_at = new Date().toISOString();
        
        const { data: newData, error: insertError } = await supabase
          .from("home_editor")
          .insert({
            homeContent: contentToStore,
            title: payload?.title,
            description: payload?.description,
            keywords: payload?.keywords,
            updated_at: new Date().toISOString()
          })
          .select("*")
          .single();

        if (insertError) {
          console.error("Error inserting record:", insertError);
          throw insertError;
        }
        
        console.log("Insert successful:", newData);
        return newData;
      }
    } catch (err) {
      console.error("Error saving home content:", err);
      throw err;
    }
  },

   /**-------------------------------------------------- */
   // Get Museum                                            |
   /**-------------------------------------------------- */
   getHomeContent: async (): Promise<HomeFormData | null> => {
    try {
      // Get existing home page content from Supabase
      const { data, error } = await supabase.from("home_editor").select("*").single();

      if (error) {
        console.error("Error fetching home content:", error);
        return null;
      }

      // If we have data, format it for our editor
      if (data) {
        console.log("Retrieved home content:", data);
        
        // Parse homeContent if it's stored as a string
        let parsedContent = data.homeContent;
        if (typeof data.homeContent === 'string') {
          try {
            parsedContent = JSON.parse(data.homeContent);
          } catch (e) {
            console.error("Error parsing homeContent JSON:", e);
          }
        }

        return {
          home_id: data.id || data.home_id,
          homeContent: parsedContent,
            title: data.title || "Home Page",
            description: data.description || "",
            keywords: data.keywords || "",
          updated_at: data.updated_at,
          created_at: data.created_at
        };
      }

      // Return a default structure if no data exists
      return null;
    } catch (err) {
      console.error("Error in getHomeContent:", err);
      return null;
    }
  },
}

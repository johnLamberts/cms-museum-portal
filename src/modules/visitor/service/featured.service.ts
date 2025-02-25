import supabase from "@/lib/supabase";

export default {
  featuredEvents: async () => {
    try {
      const {data, error} = await supabase.from("events").select("*").order("created_at", { ascending: false }).limit(3);

      if (error) throw Error(JSON.stringify(error, null, 2));

      return data;

    } catch (err) {
     if (err instanceof Error) {
        console.log(err);
        throw new Error(`${err}`);
      }
    }
  },

  getFeaturedEventById: async (id?: string) => {
    try {
      const {data, error} = await supabase.from("events").select("*").eq("event_id", id).single();

      if (error) throw Error(JSON.stringify(error, null, 2));

      return data;

    } catch (err) {
     if (err instanceof Error) {
        console.log(err);
        throw new Error(`${err}`);
      }
    }
  }
}

import supabase from "@/lib/supabase";

export default {
  featuredEvents: async () => {
    try {
      const {data, error} = await supabase.from("events").select("").order("created_at", { ascending: true }).limit(3);

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

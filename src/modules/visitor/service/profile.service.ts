import supabase from "@/lib/supabase"

export default {
  getUserPosts: async (payloadId?: string) => {
    const { data, error: postsError } = await supabase
    .from("posts_with_users")
    .select("*")
    .eq("user_uid", payloadId)


    if(postsError) throw `${JSON.stringify(postsError, null, 2)}`

    return data
  }
}

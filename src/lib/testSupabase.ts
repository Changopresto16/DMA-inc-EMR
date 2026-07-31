import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase connection error:", error.message);
    return;
  }

  console.log("Supabase connected successfully.", data);
}
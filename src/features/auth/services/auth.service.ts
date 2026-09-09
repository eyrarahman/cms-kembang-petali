import { createClient } from "@/lib/supabase/client";

export async function signInAdmin(
  email: string,
  password: string
) {
  const supabase = createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOutAdmin() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      throw new Error(error.message);
    }
  }
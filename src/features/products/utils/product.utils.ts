export function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  export function getProductImagePublicUrl(
    storagePath: string
  ) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;
  
    if (!supabaseUrl) {
      return "";
    }
  
    return `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}`;
  }
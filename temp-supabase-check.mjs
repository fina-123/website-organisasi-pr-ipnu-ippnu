import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const envText = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).filter(l => l && !l.startsWith("#")).map(l => l.split("=", 2)));
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}
const supabase = createClient(url, key);
const { data, error } = await supabase.from("members").select("id").limit(1);
if (error) {
  console.error("Supabase request error:", error.message || JSON.stringify(error));
  process.exit(1);
}
console.log("Supabase connected; members query returned count", data?.length ?? 0);

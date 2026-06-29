import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const email = "finna2832@gmail.com";
const password = "fina123";
const envText = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).filter(l => l && !l.startsWith("#")).map(l => l.split("=", 2)));
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}
const supabase = createClient(url, key);
console.log('Attempting signIn for', email);
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
  console.error('signIn error:', error.message || JSON.stringify(error));
  process.exit(1);
}
console.log('signIn data:', JSON.stringify(data));
const userId = data?.user?.id;
if (!userId) {
  console.log('No user id in session; sign-in succeeded but no session returned.');
  process.exit(0);
}
console.log('Querying members for auth_id', userId);
const { data: memberData, error: memberError } = await supabase.from('members').select('role, full_name').eq('auth_id', userId).single();
if (memberError) {
  console.error('members query error:', memberError.message || JSON.stringify(memberError));
  process.exit(1);
}
console.log('members row:', JSON.stringify(memberData));

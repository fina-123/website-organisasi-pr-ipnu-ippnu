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
console.log('Attempting signUp for', email);
const { data, error } = await supabase.auth.signUp({ email, password });
if (error) {
  console.error('signUp error:', error.message || JSON.stringify(error));
  process.exit(1);
}
console.log('signUp result:', JSON.stringify(data));
const userId = data?.user?.id;
if (!userId) {
  console.log('No user id returned; sign-up may require email confirmation.');
  process.exit(0);
}
console.log('Inserting into members table for auth_id', userId);
const { data: insertData, error: insertError } = await supabase.from('members').insert([{ auth_id: userId, email, role: 'user', full_name: 'Finna' }]);
if (insertError) {
  console.error('Insert members error:', insertError.message || JSON.stringify(insertError));
  process.exit(1);
}
console.log('Inserted members row:', JSON.stringify(insertData));

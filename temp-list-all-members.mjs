import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const envText = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).filter(l => l && !l.startsWith("#")).map(l => l.split("=",2)));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('members').select('id, auth_id, email, role, full_name, created_at').limit(100);
if (error) { console.error('Error listing members:', error.message || JSON.stringify(error)); process.exit(1); }
console.log('members:', JSON.stringify(data, null, 2));

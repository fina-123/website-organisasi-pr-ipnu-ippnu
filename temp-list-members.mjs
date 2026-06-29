import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const authId = "ad6dd06d-f344-4c51-833b-066eed5c4720";
const envText = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).filter(l => l && !l.startsWith("#")).map(l => l.split("=", 2)));
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);
const { data, error } = await supabase.from('members').select('id, auth_id, email, role, full_name, created_at').eq('auth_id', authId);
if (error) { console.error('Error fetching members:', error.message || JSON.stringify(error)); process.exit(1); }
console.log('members rows:', JSON.stringify(data, null, 2));

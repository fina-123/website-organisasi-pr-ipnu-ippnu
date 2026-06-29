import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const envText = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).filter(l => l && !l.startsWith("#")).map(l => l.split("=",2)));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const cols = await supabase.from('information_schema.columns').select('column_name,is_nullable,data_type,character_maximum_length').eq('table_name','members');
const pk = await supabase.rpc('sql', { query: `SELECT c.column_name FROM information_schema.table_constraints tc JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name WHERE constraint_type = 'PRIMARY KEY' AND tc.table_name = 'members';` });
console.log('cols', JSON.stringify(cols, null, 2));
console.log('pk', JSON.stringify(pk, null, 2));

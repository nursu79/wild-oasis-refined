const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function inspect() {
  console.log("Inserting and inspecting guest...");

  // 1. Insert minimal valid guest
  const { data: inserted, error: insertErr } = await supabase
    .from('guests')
    .insert([{ email: 'schema_probe@test.com', name: 'Schema Probe' }])
    .select();

  if (insertErr) {
    console.error("Insert failed:", insertErr.message);
    return;
  }

  // 2. Log keys
  if (inserted && inserted.length > 0) {
    console.log("SCHEMA KEYS:", Object.keys(inserted[0]));
    
    // 3. Cleanup
    await supabase.from('guests').delete().eq('id', inserted[0].id);
  } else {
    console.log("Insert succeeded but no data returned?");
  }
}

inspect();

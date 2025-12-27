const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function inspectSchema() {
  console.log("Checking columns for 'bookings' table...");
  
  // Use RPC if available or a direct query to information_schema via a trick?
  // Supabase JS doesn't allow raw SQL easily without RPC.
  // But we can try to select from a non-existent column and see if the error is more helpful
  // OR just try to select everything and see if we get back an empty array with headers in some clients?
  
  // Actually, let's try to select '*' and see if any results (if even one exists)
  const { data, error } = await supabase.from('bookings').select('*').limit(1);
  
  if (error) {
    console.error("Select * error:", error);
  } else if (data && data.length > 0) {
    console.log("Found columns:", Object.keys(data[0]));
  } else {
    console.log("Table is empty, trying invalid select to force column list in some error contexts (unlikely but worth a shot)...");
  }

  // Another way: Try to insert an empty object and see the error?
  const { error: insertError } = await supabase.from('bookings').insert([{}]).select();
  console.log("Insert empty error (might list missing required columns):", insertError);
}

inspectSchema();

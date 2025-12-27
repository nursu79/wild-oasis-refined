const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkColumns() {
  const { data, error } = await supabase.from("bookings").select("*").limit(1);
  if (error) {
    console.error("Error fetching bookings:", error);
    // Try to insert a dummy record to see specific column error if select works but insert fails? 
    // No, usually select * returns keys which ARE the column names.
  }
  if (data && data.length > 0) {
    console.log("Existing booking keys:", Object.keys(data[0]));
  } else {
    console.log("No bookings found. Trying to infer from error on invalid select...");
    const { error: err2 } = await supabase.from("bookings").select("non_existent_column").limit(1);
    console.log("Error details which might list columns:", err2);
  }
}

checkColumns();

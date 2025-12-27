const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error("Error fetching cabins:", error);
  }
  if (data && data.length > 0) {
    console.log("Cabin columns:", Object.keys(data[0]));
    data.forEach(cabin => {
      console.log(`Cabin ${cabin.name}: lat=${cabin.latitude}, lng=${cabin.longitude}`);
    });
  } else {
    console.log("No cabins found.");
  }
}

checkCabins();

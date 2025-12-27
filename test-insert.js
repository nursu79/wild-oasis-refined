const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testInsert() {
  // Use lowercase keys, omit cabinprice, extrasprice
  const newBooking = {
    startdate: new Date().toISOString(),
    enddate: new Date().toISOString(),
    numnights: 1,
    // cabinprice: 100, 
    cabinid: 10,
    guestid: 2, 
    numguests: 1,
    observations: "Test",
    // extrasprice: 0,
    totalprice: 100,
    ispaid: false,
    has_breakfast: false,
    status: "unconfirmed"
  };

  const { data, error } = await supabase.from("bookings").insert([newBooking]).select();
  
  if (error) {
    console.error("Insert Error:", error);
  } else {
    console.log("Insert Success! Columns are definitely snake_case.");
  }
}

testInsert();

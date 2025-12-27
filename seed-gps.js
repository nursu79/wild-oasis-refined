const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const cabinCoordinates = [
  { name: "010", lat: 46.735, lng: 12.2833 },
  { name: "011", lat: 46.732, lng: 12.288 },
  { name: "012", lat: 46.738, lng: 12.280 },
  { name: "013", lat: 46.730, lng: 12.295 },
];

async function seedCoordinates() {
  console.log("Starting GPS Seed for Alpine Reflections...");
  
  for (const coord of cabinCoordinates) {
    const { error } = await supabase
      .from("cabins")
      .update({ latitude: coord.lat, longitude: coord.lng })
      .eq("name", coord.name);
      
    if (error) {
      console.error(`Error updating Cabin ${coord.name}:`, error);
    } else {
      console.log(`Successfully updated Cabin ${coord.name} with coordinates: ${coord.lat}, ${coord.lng}`);
    }
  }
  
  console.log("GPS Seeding complete.");
}

seedCoordinates();

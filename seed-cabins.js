const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Using ONLY the high-quality PNGs as requested
const cabins = [
  {
    name: "010", // Unique IDs to avoid conflict with previous seeds
    maxcapacity: 2,
    regularprice: 450,
    discount: 0,
    image: "/Gemini_Generated_Image_gwwfuggwwfuggwwf.png" // Exterior Cabin
  },
  {
    name: "011",
    maxcapacity: 4,
    regularprice: 650,
    discount: 50,
    image: "/Gemini_Generated_Image_rdr0g2rdr0g2rdr0.png" // Exterior/Interior Variant
  },
  {
    name: "012",
    maxcapacity: 6,
    regularprice: 900,
    discount: 100,
    image: "/bg.png" // The original HQ background
  },
  {
    name: "013",
    maxcapacity: 4,
    regularprice: 550,
    discount: 0,
    image: "/noGemini_Generated_Image_6r5odv6r5odv6r5o.png" // Another generated asset
  }
];

async function seed() {
  console.log('🌱 Starting seed (PNGs only)...');
  
  const { data, error } = await supabase
    .from('cabins')
    .insert(cabins)
    .select();

  if (error) {
    console.error('Error seeding cabins:', error);
  } else {
    console.log(`✅ Successfully added ${data.length} luxury cabins with PNG images!`);
  }
}

seed();

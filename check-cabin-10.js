const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCabin10() {
  console.log(`🔎 Checking Cabin 010 data...`);
  
  const { data: cabin, error } = await supabase
    .from('cabins')
    .select('name, latitude, longitude, arrival_instructions, proximity_stats')
    .eq('name', '010')
    .single();

  if (error) {
    console.error('❌ Error fetching cabin:', error.message);
  } else {
    console.log('✅ Cabin 010 Found:');
    console.log(JSON.stringify(cabin, null, 2));
  }
}

checkCabin10();

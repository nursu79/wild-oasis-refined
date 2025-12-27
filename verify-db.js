const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log(`📡 Connecting to Supabase at: ${supabaseUrl}...`);
  
  const { count, error } = await supabase
    .from('cabins')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Connection Failed:', error.message);
  } else {
    console.log('✅ Connection Successful!');
    console.log(`📊 Found ${count} cabins in the database.`);
    
    // Fetch one cabin to prove data access
    const { data: cabin } = await supabase.from('cabins').select('name').limit(1).single();
    if(cabin) {
       console.log(`📝 Sample Data: Verified access to Cabin "${cabin.name}"`);
    }
  }
}

verifyConnection();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function listCabins() {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, image');

  if (error) {
    console.error(error);
  } else {
    console.log('--- Current Cabins in DB ---');
    data.forEach(c => console.log(`[${c.id}] Name: "${c.name}", Image: ${c.image}`));
  }
}

listCabins();

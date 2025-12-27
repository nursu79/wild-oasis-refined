const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function cleanup() {
  console.log('🧹 Starting cleanup...');

  // Delete all cabins that have .jpeg or .jpg images
  // We want to keep ONLY the .png ones we just added (010, 011, 012, 013)
  const { data, error } = await supabase
    .from('cabins')
    .delete()
    .or('image.ilike.%.jpeg,image.ilike.%.jpg');

  if (error) {
    console.error('Error cleaning up cabins:', error);
  } else {
    // Aggressive Cleanup: Keep ONLY the new luxury cabins we just added
    // IDs or Names we want to KEEP: '010', '011', '012', '013'
    
    // Delete anything that is NOT one of our new luxury cabins
    const { error: deleteError } = await supabase
      .from('cabins')
      .delete()
      .not('name', 'in', '("010","011","012","013")');

    if (deleteError) {
        console.error('Error deleting old cabins:', deleteError);
    } else {
        console.log('✅ Successfully removed EVERYTHING except cabins 010, 011, 012, 013!');
    }
  }
}

cleanup();

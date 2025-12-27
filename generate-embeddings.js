const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function generateEmbeddings() {
  console.log('Fetching cabins from database...');
  const { data: cabins, error } = await supabase
    .from('cabins')
    .select('id, name, description');

  if (error) {
    console.error('Error fetching cabins:', error);
    return;
  }

  console.log(`Found ${cabins.length} cabins. Generating embeddings with Gemini (text-embedding-004)...`);

  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  for (const cabin of cabins) {
    if (!cabin.description) {
      console.log(`Skipping cabin ${cabin.name} (no description)`);
      continue;
    }

    console.log(`Generating embedding for: ${cabin.name}`);
    
    try {
      const result = await model.embedContent(`Cabin name: ${cabin.name}. Description: ${cabin.description}`);
      const embedding = result.embedding.values;

      const { error: updateError } = await supabase
        .from('cabins')
        .update({ embedding })
        .eq('id', cabin.id);

      if (updateError) {
        console.error(`Error updating cabin ${cabin.name}:`, updateError);
      } else {
        console.log(`Successfully updated ${cabin.name}`);
      }
    } catch (err) {
      console.error(`Failed to generate embedding for ${cabin.name}:`, err.message);
    }
  }

  console.log('Embedding generation complete!');
}

generateEmbeddings();

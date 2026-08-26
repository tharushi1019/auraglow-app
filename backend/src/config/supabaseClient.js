const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[supabaseClient] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env — auth routes will fail until this is set.'
  );
}

// The service role key is used on the BACKEND ONLY. Never expose it to the frontend.
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

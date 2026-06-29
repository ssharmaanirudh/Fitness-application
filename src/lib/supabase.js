import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dtzjthrothtzoulvymoz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BQvz6iEyKCaljyCABhDEHg_w9eCXdyt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

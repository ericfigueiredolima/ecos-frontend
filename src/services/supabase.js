import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vjpxzcilschmyssngoiox.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6aBQDC0krDlG8Vn096sg_g_zDPk-TaC'; // Insira sua chave anon/public do painel do Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
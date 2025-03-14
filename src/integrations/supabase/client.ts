
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lijhqhstarvrujlpntkd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpamhxaHN0YXJ2cnVqbHBudGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTk0OTgsImV4cCI6MjA1NzM5NTQ5OH0.7-7gHaitHJy6FDDYBKHNf0YAhlq3QcV0GQkU8YmEDC0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

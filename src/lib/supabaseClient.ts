import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxcklitbgplptritcimn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y2tsaXRiZ3BscHRyaXRjaW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTQ3MjYsImV4cCI6MjA3MTMzMDcyNn0.Ajxg8Zv90qm0sXQNNQf_snbEealG2YHBTtcpezW-Gq8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

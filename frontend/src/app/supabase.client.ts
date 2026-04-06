import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kctjcjzeezvuuwgfcmxs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdGpjanplZXp2dXV3Z2ZjbXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjIzMTcsImV4cCI6MjA4OTgzODMxN30.npnTG26uLteNro2APmmZG5DQsvWN25-R7M3u36OoW_8'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token', // Nome fixo para o storage
    // flowType: 'pkce', // Mais moderno e estável
  }
})
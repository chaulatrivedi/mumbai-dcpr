import { createClient } from '@supabase/supabase-js'

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

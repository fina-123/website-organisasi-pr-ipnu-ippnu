import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi: key Supabase bisa format JWT (eyJ...) atau format baru (sb_publishable_...)
const isValidKey = supabaseAnonKey && 
  typeof supabaseAnonKey === 'string' && 
  (supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_publishable_')) &&
  supabaseUrl &&
  supabaseUrl.startsWith('https://')

export const supabase: SupabaseClient | null = isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = !!supabase

/**
 * Cek koneksi Supabase dengan timeout.
 * Jika dalam 4 detik tidak ada response, anggap offline.
 */
let _connectionChecked = false
let _connectionOk = false

export async function checkSupabaseConnection(timeoutMs = 4000): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false
  if (_connectionChecked) return _connectionOk

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const { error } = await supabase.from('members').select('id', { count: 'exact', head: true }).abortSignal(controller.signal)
    _connectionOk = !error
  } catch {
    _connectionOk = false
  } finally {
    clearTimeout(timeoutId)
    _connectionChecked = true
  }

  return _connectionOk
}

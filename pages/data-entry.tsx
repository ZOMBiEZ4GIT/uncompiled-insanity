// pages/data-entry.tsx
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function DataEntry() {
  useEffect(() => {
    // This will print our Supabase client object to the browser console
    console.log('✅ Supabase client:', supabase)
  }, [])

  return (
    <div>
      <h1>Data Entry</h1>
      {/* your form will go here */}
    </div>
  )
}
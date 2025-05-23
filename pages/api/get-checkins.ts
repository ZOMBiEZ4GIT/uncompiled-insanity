import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Replace with real user_id from session/auth
  const user_id = 'demo-user-id';
  const { data, error } = await supabase
    .from('monthly_checkins')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}

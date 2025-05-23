import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

function isAuthed(req: NextApiRequest) {
  return req.cookies?.auth === 'true';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { data, error } = await supabase
    .from('monthly_checkins')
    .select('*')
    .order('date', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}

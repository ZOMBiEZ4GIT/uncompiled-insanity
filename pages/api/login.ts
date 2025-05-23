import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const sitePassword = process.env.SITE_PASSWORD || 'TEST';

  if (password === sitePassword) {
    res.setHeader('Set-Cookie', 'auth=true; Path=/; HttpOnly; SameSite=Lax');
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
}

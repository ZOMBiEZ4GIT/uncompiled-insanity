import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('BODY:', req.body);

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { month, year, super_amount, cash_savings, debt_amount } = req.body;
    // TODO: Replace with real user_id from session/auth
    const user_id = 'demo-user-id';

    // 1. Get live prices for stocks, etf, crypto
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      'http://localhost:3000';

    console.log('Fetching live prices from:', `${baseUrl}/api/live-prices`);
    const liveRes = await fetch(`${baseUrl}/api/live-prices`);
    const { data: liveData } = await liveRes.json();

    // 2. Sum up asset values
    let stocks_value = 0,
      etf_value = 0,
      crypto_value = 0;
    liveData.forEach((asset: any) => {
      if (asset.type === 'stock') stocks_value += asset.currentValue || 0;
      if (asset.type === 'etf') etf_value += asset.currentValue || 0;
      if (asset.type === 'crypto') crypto_value += asset.currentValue || 0;
    });

    // 3. Calculate net worth
    const net_worth =
      super_amount + cash_savings + stocks_value + etf_value + crypto_value - debt_amount;

    // 4. Upsert into monthly_checkins
    const date = `${year}-${String(month).padStart(2, '0')}-01`;
    const { error } = await supabase.from('monthly_checkins').upsert(
      [
        {
          date,
          super_amount,
          cash_savings,
          debt_amount,
          stocks_amount: stocks_value,
          etf_amount: etf_value,
          crypto_amount: crypto_value,
          net_worth,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'date' }
    );

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: String(err) });
  }
}

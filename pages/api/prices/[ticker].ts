import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ticker } = req.query;
  if (typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker required' });
  }

  try {
    const searchRes = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(ticker)}`
    );
    if (!searchRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch' });
    }
    const searchData = await searchRes.json();
    const coin = searchData.coins.find(
      (c: any) =>
        c.symbol.toLowerCase() === ticker.toLowerCase() ||
        c.id === ticker.toLowerCase()
    );
    if (!coin) {
      return res.status(404).json({ error: 'Ticker not found' });
    }

    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd`
    );
    if (!priceRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch price' });
    }
    const priceData = await priceRes.json();
    const price = priceData[coin.id]?.usd;
    if (price === undefined) {
      return res.status(404).json({ error: 'Price not found' });
    }
    res.status(200).json({ ticker: coin.symbol.toUpperCase(), usd: price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
}

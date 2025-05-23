import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

function isAuthed(req: NextApiRequest) {
  return req.cookies?.auth === 'true';
}

// Types for price data
interface PriceData {
  ticker: string;
  type: 'stock' | 'etf' | 'crypto';
  price: number;
  currency: string;
  lastUpdated: string;
  currentHoldings?: number;
  currentValue?: number;
}

interface TickerData {
  ticker_code?: string;
  ticker?: string;
}

// --- Hardcoded mappings ---
const COINGECKO_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  CRO: 'crypto-com-chain',
  FUN: 'funfair',
  BAT: 'basic-attention-token',
  MATIC: 'polygon',
  NEO: 'neo',
};

// Function to map tickers for Yahoo Finance
function mapYahooSymbol(ticker: string): string | null {
  if (ticker.startsWith('ASX:')) return ticker.replace('ASX:', '') + '.AX';
  if (ticker.startsWith('NASDAQ:')) return ticker.replace('NASDAQ:', '');
  return ticker;
}

// Function to fetch crypto prices using CoinGecko API
async function fetchCryptoPrices(tickers: string[]): Promise<PriceData[]> {
  const mapped = tickers
    .map((ticker) => ({ original: ticker, id: COINGECKO_MAP[ticker.toUpperCase()] }))
    .filter((t) => t.id);
  if (mapped.length === 0) return [];
  try {
    const holdings = await fetchCurrentHoldings(); // Fetch current holdings
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${mapped.map((t) => t.id).join(',')}&vs_currencies=usd&include_last_updated_at=true`
    );
    const data = await response.json();
    return mapped
      .map(({ original, id }) => {
        const priceData = data[id];
        const currentHoldings = Number((holdings[original] || 0).toFixed(3));
        return priceData
          ? {
              ticker: original,
              type: 'crypto',
              price: Number(priceData.usd.toFixed(3)),
              currency: 'USD',
              lastUpdated: new Date(priceData.last_updated_at * 1000).toISOString(),
              currentHoldings: currentHoldings,
              currentValue: Number((priceData.usd * currentHoldings).toFixed(3)),
            }
          : null;
      })
      .filter(Boolean) as PriceData[];
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
}

// Function to fetch current holdings
async function fetchCurrentHoldings(): Promise<Record<string, number>> {
  const holdings: Record<string, number> = {};

  // Fetch all transactions in parallel
  const [{ data: cryptoData }, { data: etfData }, { data: stockData }] = await Promise.all([
    supabase.from('crypto_transactions').select('ticker_code, units_delta'),
    supabase.from('etf_transactions').select('ticker, units_delta'),
    supabase.from('stock_transactions').select('ticker, volume'),
  ]);

  // Calculate crypto holdings
  if (cryptoData) {
    cryptoData.forEach((tx) => {
      if (tx.ticker_code) {
        holdings[tx.ticker_code] = (holdings[tx.ticker_code] || 0) + Number(tx.units_delta);
      }
    });
  }

  // Calculate ETF holdings
  if (etfData) {
    etfData.forEach((tx) => {
      if (tx.ticker) {
        holdings[tx.ticker] = (holdings[tx.ticker] || 0) + Number(tx.units_delta);
      }
    });
  }

  // Calculate stock holdings
  if (stockData) {
    stockData.forEach((tx) => {
      if (tx.ticker) {
        holdings[tx.ticker] = (holdings[tx.ticker] || 0) + Number(tx.volume);
      }
    });
  }

  return holdings;
}

// Function to fetch stock and ETF prices using MarketStack API
async function fetchStockAndEtfPrices(tickers: string[]): Promise<PriceData[]> {
  const mapped = tickers
    .map((ticker) => ({ original: ticker, id: mapYahooSymbol(ticker) }))
    .filter((t) => t.id !== null);
  if (mapped.length === 0) return [];
  try {
    const apiKey = process.env.MARKETSTACK_API_KEY;
    const prices: PriceData[] = [];
    const holdings = await fetchCurrentHoldings();
    for (const { original, id } of mapped) {
      const url = `http://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${id}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        console.error(`Error fetching data for ${id}:`, data.error);
        continue;
      }
      if (data.data && data.data.length > 0) {
        const currentPrice = Number(data.data[0].close.toFixed(3));
        const currentHoldings = Number((holdings[original] || 0).toFixed(3));
        prices.push({
          ticker: original,
          type: original.startsWith('ASX:')
            ? original.includes('VDHG') || original.includes('VGE')
              ? 'etf'
              : 'stock'
            : 'stock',
          price: currentPrice,
          currency: 'USD',
          lastUpdated: new Date().toISOString(),
          currentHoldings: currentHoldings,
          currentValue: Number((currentPrice * currentHoldings).toFixed(3)),
        });
      }
    }
    return prices;
  } catch (error) {
    console.error('Error fetching stock/ETF prices from MarketStack:', error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch unique tickers from all asset tables
    const [{ data: cryptoTickers }, { data: etfTickers }, { data: stockTickers }] =
      await Promise.all([
        supabase.from('crypto_transactions').select('ticker_code'),
        supabase.from('etf_transactions').select('ticker'),
        supabase.from('stock_transactions').select('ticker'),
      ]);

    // Extract unique tickers
    const uniqueCrypto = [
      ...new Set(
        ((cryptoTickers as TickerData[]) || []).map((t) => t.ticker_code?.toUpperCase() || '')
      ),
    ].filter(Boolean);
    const uniqueEtf = [
      ...new Set(((etfTickers as TickerData[]) || []).map((t) => t.ticker || '')),
    ].filter(Boolean);
    const uniqueStock = [
      ...new Set(((stockTickers as TickerData[]) || []).map((t) => t.ticker || '')),
    ].filter(Boolean);

    // Fetch prices in parallel
    const [cryptoPrices, stockEtfPrices] = await Promise.all([
      fetchCryptoPrices(uniqueCrypto),
      fetchStockAndEtfPrices([...uniqueEtf, ...uniqueStock]),
    ]);

    // Combine all prices
    const allPrices = [...cryptoPrices, ...stockEtfPrices];

    return res.status(200).json({
      success: true,
      data: allPrices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching live prices:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch live prices',
    });
  }
}

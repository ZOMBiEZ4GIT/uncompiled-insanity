import { useState } from 'react';

interface PriceData {
  ticker: string;
  type: 'stock' | 'etf' | 'crypto';
  price: number;
  currency: string;
  lastUpdated: string;
  currentHoldings?: number;
  currentValue?: number;
}

export default function LivePrices() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/live-prices');
      const data = await response.json();
      if (data.success) {
        setPrices(data.data);
      } else {
        setError('Failed to fetch prices');
      }
    } catch (err) {
      setError('Error fetching prices');
    } finally {
      setLoading(false);
    }
  };

  // Filter prices based on hideZeroBalance toggle
  const filteredPrices = hideZeroBalance
    ? prices.filter((price) => (price.currentValue || 0) > 0)
    : prices;

  return (
    <div className="p-6 bg-earth-card rounded-xl w-full shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-earth">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-earth-primary">Live Prices</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-earth">
            <input
              type="checkbox"
              checked={hideZeroBalance}
              onChange={(e) => setHideZeroBalance(e.target.checked)}
              className="rounded border-earth bg-earth-background text-earth-accent focus:ring-earth-accent"
            />
            Hide Zero Balance
          </label>
          <button
            className="px-4 py-2 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition disabled:opacity-50"
            onClick={fetchPrices}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Latest Price'}
          </button>
        </div>
      </div>
      {error && <div className="text-earth-accent mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-earth">
              <th className="pb-2 text-earth-primary">Ticker</th>
              <th className="pb-2 text-earth-primary">Type</th>
              <th className="pb-2 text-earth-primary">Price</th>
              <th className="pb-2 text-earth-primary">Amount Owned</th>
              <th className="pb-2 text-earth-primary">Total Value</th>
              <th className="pb-2 text-earth-primary">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-earth">
                  No data to display
                </td>
              </tr>
            )}
            {filteredPrices.map((price) => (
              <tr key={price.ticker} className="border-b border-earth/20">
                <td className="py-2 text-earth">{price.ticker}</td>
                <td className="py-2 text-earth">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      price.type === 'crypto'
                        ? 'bg-purple-500/20 text-purple-300'
                        : price.type === 'etf'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {price.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 text-earth">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency,
                  }).format(price.price)}
                </td>
                <td className="py-2 text-earth">
                  {price.currentHoldings !== undefined ? price.currentHoldings : '-'}
                </td>
                <td className="py-2 text-earth">
                  {price.currentValue !== undefined
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currency,
                      }).format(price.currentValue)
                    : '-'}
                </td>
                <td className="py-2 text-earth">{new Date(price.lastUpdated).toLocaleString()}</td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-earth">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

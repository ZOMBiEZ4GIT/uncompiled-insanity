// pages/data-entry.tsx
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

const categories = [
  { key: 'crypto', label: 'Crypto' },
  { key: 'etf', label: 'ETF' },
  { key: 'stock', label: 'Stock' },
  { key: 'super', label: 'Super' },
];

export default function DataEntry() {
  const [step, setStep] = useState<'select' | 'form' | 'result'>('select');
  const [category, setCategory] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Form state for each category
  const [cryptoForm, setCryptoForm] = useState({
    ticker_code: '',
    order_date: '',
    units_delta: '',
    unit_price: '',
    fee: '',
  });
  const [etfForm, setEtfForm] = useState({
    ticker: '',
    order_date: '',
    units_delta: '',
    order_price: '',
    brokerage: '',
  });
  const [stockForm, setStockForm] = useState({
    ticker: '',
    purchase_date: '',
    volume: '',
    bought_price_aud: '',
    brokerage: '',
  });
  const [superForm, setSuperForm] = useState({
    date: '',
    voluntary_contributions: '',
    employer_contributions: '',
    total_value: '',
  });

  // Handle category selection with animation
  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setTimeout(() => setStep('form'), 400); // Simulate animation delay
  };

  // Handle form submits
  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker_code, order_date, units_delta, unit_price, fee } =
      cryptoForm;
    const { error } = await supabase.from('crypto_transactions').insert([
      {
        ticker_code,
        order_date,
        units_delta: Number(units_delta),
        unit_price: Number(unit_price),
        fee: Number(fee),
      },
    ]);
    if (error) {
      setResult({ success: false, message: error.message });
    } else {
      setResult({ success: true, message: 'Crypto transaction added!' });
    }
    setStep('result');
  };

  const handleEtfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker, order_date, units_delta, order_price, brokerage } = etfForm;
    const { error } = await supabase.from('etf_transactions').insert([
      {
        ticker,
        order_date,
        units_delta: Number(units_delta),
        order_price: Number(order_price),
        brokerage: Number(brokerage),
      },
    ]);
    if (error) {
      setResult({ success: false, message: error.message });
    } else {
      setResult({ success: true, message: 'ETF transaction added!' });
    }
    setStep('result');
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker, purchase_date, volume, bought_price_aud, brokerage } =
      stockForm;
    const { error } = await supabase.from('stock_transactions').insert([
      {
        ticker,
        purchase_date,
        volume: Number(volume),
        bought_price_aud: Number(bought_price_aud),
        brokerage: Number(brokerage),
      },
    ]);
    if (error) {
      setResult({ success: false, message: error.message });
    } else {
      setResult({ success: true, message: 'Stock transaction added!' });
    }
    setStep('result');
  };

  const handleSuperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      date,
      voluntary_contributions,
      employer_contributions,
      total_value,
    } = superForm;
    const { error } = await supabase.from('super_snapshots').insert([
      {
        date,
        voluntary_contributions: Number(voluntary_contributions),
        employer_contributions: Number(employer_contributions),
        total_value: Number(total_value),
      },
    ]);
    if (error) {
      setResult({ success: false, message: error.message });
    } else {
      setResult({ success: true, message: 'Super snapshot added!' });
    }
    setStep('result');
  };

  // Reset to start
  const handleReset = () => {
    setStep('select');
    setCategory(null);
    setResult(null);
    setCryptoForm({
      ticker_code: '',
      order_date: '',
      units_delta: '',
      unit_price: '',
      fee: '',
    });
    setEtfForm({
      ticker: '',
      order_date: '',
      units_delta: '',
      order_price: '',
      brokerage: '',
    });
    setStockForm({
      ticker: '',
      purchase_date: '',
      volume: '',
      bought_price_aud: '',
      brokerage: '',
    });
    setSuperForm({
      date: '',
      voluntary_contributions: '',
      employer_contributions: '',
      total_value: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111827] p-4">
      <div className="bg-[#18181B] border border-zinc-800 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all duration-500">
        {step === 'select' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Select Category
            </h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className="py-4 px-6 rounded-xl bg-accent text-white font-semibold text-lg shadow hover:bg-brand transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleCategorySelect(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 'form' && category === 'crypto' && (
          <form className="space-y-4" onSubmit={handleCryptoSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Add Crypto Transaction
            </h2>
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Ticker (e.g. BTC)"
              value={cryptoForm.ticker_code}
              onChange={(e) =>
                setCryptoForm((f) => ({ ...f, ticker_code: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              type="date"
              value={cryptoForm.order_date}
              onChange={(e) =>
                setCryptoForm((f) => ({ ...f, order_date: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Units"
              type="number"
              step="any"
              value={cryptoForm.units_delta}
              onChange={(e) =>
                setCryptoForm((f) => ({ ...f, units_delta: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Unit Price"
              type="number"
              step="any"
              value={cryptoForm.unit_price}
              onChange={(e) =>
                setCryptoForm((f) => ({ ...f, unit_price: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Fee"
              type="number"
              step="any"
              value={cryptoForm.fee}
              onChange={(e) =>
                setCryptoForm((f) => ({ ...f, fee: e.target.value }))
              }
              required
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-accent text-white font-bold hover:bg-brand transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
                onClick={handleReset}
              >
                Back
              </button>
            </div>
          </form>
        )}
        {step === 'form' && category === 'etf' && (
          <form className="space-y-4" onSubmit={handleEtfSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Add ETF Transaction
            </h2>
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Ticker (e.g. VAS)"
              value={etfForm.ticker}
              onChange={(e) =>
                setEtfForm((f) => ({ ...f, ticker: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              type="date"
              value={etfForm.order_date}
              onChange={(e) =>
                setEtfForm((f) => ({ ...f, order_date: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Units"
              type="number"
              step="any"
              value={etfForm.units_delta}
              onChange={(e) =>
                setEtfForm((f) => ({ ...f, units_delta: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Order Price"
              type="number"
              step="any"
              value={etfForm.order_price}
              onChange={(e) =>
                setEtfForm((f) => ({ ...f, order_price: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Brokerage"
              type="number"
              step="any"
              value={etfForm.brokerage}
              onChange={(e) =>
                setEtfForm((f) => ({ ...f, brokerage: e.target.value }))
              }
              required
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-accent text-white font-bold hover:bg-brand transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
                onClick={handleReset}
              >
                Back
              </button>
            </div>
          </form>
        )}
        {step === 'form' && category === 'stock' && (
          <form className="space-y-4" onSubmit={handleStockSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Add Stock Transaction
            </h2>
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Ticker (e.g. AAPL)"
              value={stockForm.ticker}
              onChange={(e) =>
                setStockForm((f) => ({ ...f, ticker: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              type="date"
              value={stockForm.purchase_date}
              onChange={(e) =>
                setStockForm((f) => ({ ...f, purchase_date: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Volume"
              type="number"
              step="any"
              value={stockForm.volume}
              onChange={(e) =>
                setStockForm((f) => ({ ...f, volume: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Bought Price (AUD)"
              type="number"
              step="any"
              value={stockForm.bought_price_aud}
              onChange={(e) =>
                setStockForm((f) => ({
                  ...f,
                  bought_price_aud: e.target.value,
                }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Brokerage"
              type="number"
              step="any"
              value={stockForm.brokerage}
              onChange={(e) =>
                setStockForm((f) => ({ ...f, brokerage: e.target.value }))
              }
              required
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-accent text-white font-bold hover:bg-brand transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
                onClick={handleReset}
              >
                Back
              </button>
            </div>
          </form>
        )}
        {step === 'form' && category === 'super' && (
          <form className="space-y-4" onSubmit={handleSuperSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Add Super Snapshot
            </h2>
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              type="date"
              value={superForm.date}
              onChange={(e) =>
                setSuperForm((f) => ({ ...f, date: e.target.value }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Voluntary Contributions"
              type="number"
              step="any"
              value={superForm.voluntary_contributions}
              onChange={(e) =>
                setSuperForm((f) => ({
                  ...f,
                  voluntary_contributions: e.target.value,
                }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Employer Contributions"
              type="number"
              step="any"
              value={superForm.employer_contributions}
              onChange={(e) =>
                setSuperForm((f) => ({
                  ...f,
                  employer_contributions: e.target.value,
                }))
              }
              required
            />
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-[#18181B] text-white"
              placeholder="Total Value"
              type="number"
              step="any"
              value={superForm.total_value}
              onChange={(e) =>
                setSuperForm((f) => ({ ...f, total_value: e.target.value }))
              }
              required
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-accent text-white font-bold hover:bg-brand transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
                onClick={handleReset}
              >
                Back
              </button>
            </div>
          </form>
        )}
        {step === 'result' && result && (
          <div className="flex flex-col items-center">
            <h2
              className={`text-xl font-bold mb-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}
            >
              {result.success ? 'Success!' : 'Error'}
            </h2>
            <p className="mb-6">{result.message}</p>
            <button
              className="py-2 px-6 rounded bg-accent text-white font-bold hover:bg-brand transition"
              onClick={handleReset}
            >
              Add Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

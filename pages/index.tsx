import { useState, useEffect } from 'react';
import NetWorthPie from '@/components/Dashboard/NetWorthPie';
import AssetLineChart from '@/components/Dashboard/AssetLineChart';
import LivePrices from '@/components/Dashboard/LivePrices';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header';

const categories = [
  { key: 'crypto', label: 'Crypto' },
  { key: 'etf', label: 'ETF' },
  { key: 'stock', label: 'Stock' },
];

// Add types for props
interface AssetDataPoint {
  date: string;
  amount: number;
}

interface AssetData {
  title: string;
  data: AssetDataPoint[];
  color?: string;
}

interface NetWorthDatum {
  name: string;
  value: number;
}

interface DashboardProps {
  netWorthData: NetWorthDatum[];
  assetsData: AssetData[];
}

export default function Dashboard({ netWorthData = [], assetsData = [] }: DashboardProps) {
  // Asset adder app state
  const [step, setStep] = useState<'select' | 'form' | 'result'>('select');
  const [category, setCategory] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
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
  // Replace checkinForm state and form fields
  const [checkinForm, setCheckinForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    super_amount: '',
    cash_savings: '',
    debt_amount: '',
  });
  const [checkinResult, setCheckinResult] = useState<null | { success: boolean; message: string }>(
    null
  );

  // Add state for dashboard data
  const [dashboardData, setDashboardData] = useState<any[]>([]);

  // Fetch monthly_checkins for dashboard
  useEffect(() => {
    fetch('/api/get-checkins')
      .then((res) => res.json())
      .then((data) => setDashboardData(data));
  }, [checkinResult]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setTimeout(() => setStep('form'), 400);
  };
  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker_code, order_date, units_delta, unit_price, fee } = cryptoForm;
    const { error } = await supabase.from('crypto_transactions').insert([
      {
        ticker_code,
        order_date,
        units_delta: Number(units_delta),
        unit_price: Number(unit_price),
        fee: Number(fee),
      },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'Crypto transaction added!' });
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
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'ETF transaction added!' });
    setStep('result');
  };
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker, purchase_date, volume, bought_price_aud, brokerage } = stockForm;
    const { error } = await supabase.from('stock_transactions').insert([
      {
        ticker,
        purchase_date,
        volume: Number(volume),
        bought_price_aud: Number(bought_price_aud),
        brokerage: Number(brokerage),
      },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'Stock transaction added!' });
    setStep('result');
  };
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
  };
  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { month, year, super_amount, cash_savings, debt_amount } = checkinForm;
    const res = await fetch('/api/save-checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        month,
        year,
        super_amount: Number(super_amount),
        cash_savings: Number(cash_savings),
        debt_amount: Number(debt_amount),
      }),
    });
    const result = await res.json();
    setCheckinResult(
      result.success
        ? { success: true, message: 'Monthly check-in saved!' }
        : { success: false, message: result.error || 'Error saving check-in' }
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full flex flex-col items-center bg-earth-background text-earth py-10 px-2">
        <div className="w-full flex flex-row gap-12 px-2">
          {/* Main Content Grid */}
          <div className="flex-1 flex flex-col gap-10">
            <h1 className="text-4xl font-extrabold text-center text-earth-primary mb-6 tracking-tight drop-shadow">
              Insanity Dashboard
            </h1>
            {/* Top row: 3 cards (Net Worth, Monthly Check-in, Add Asset/Transaction) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
                <h2 className="text-xl font-bold mb-4 text-earth-primary text-center flex items-center gap-2">
                  Net Worth Breakdown
                </h2>
                <NetWorthPie
                  data={
                    dashboardData.length
                      ? [
                          {
                            name: 'Super',
                            value: dashboardData[dashboardData.length - 1].super_amount,
                          },
                          {
                            name: 'Cash',
                            value: dashboardData[dashboardData.length - 1].cash_savings,
                          },
                          {
                            name: 'Stocks',
                            value: dashboardData[dashboardData.length - 1].stocks_amount,
                          },
                          {
                            name: 'ETF',
                            value: dashboardData[dashboardData.length - 1].etf_amount,
                          },
                          {
                            name: 'Crypto',
                            value: dashboardData[dashboardData.length - 1].crypto_amount,
                          },
                          {
                            name: 'Debt',
                            value: -dashboardData[dashboardData.length - 1].debt_amount,
                          },
                        ]
                      : []
                  }
                  title=""
                />
              </div>
              <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
                <h2 className="text-xl font-bold mb-4 text-earth-accent text-center flex items-center gap-2">
                  Monthly Check-in
                </h2>
                <form className="space-y-3 w-full max-w-lg mx-auto" onSubmit={handleCheckinSubmit}>
                  <label className="block text-earth-primary font-semibold">Month</label>
                  <select
                    className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                    value={checkinForm.month}
                    onChange={(e) =>
                      setCheckinForm((f) => ({ ...f, month: Number(e.target.value) }))
                    }
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <label className="block text-earth-primary font-semibold">Year</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                    type="number"
                    value={checkinForm.year}
                    onChange={(e) =>
                      setCheckinForm((f) => ({ ...f, year: Number(e.target.value) }))
                    }
                    min="2000"
                    max="2100"
                    required
                  />
                  <label className="block text-earth-primary font-semibold">Super Amount</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                    type="number"
                    placeholder="Super Amount"
                    value={checkinForm.super_amount}
                    onChange={(e) =>
                      setCheckinForm((f) => ({ ...f, super_amount: e.target.value }))
                    }
                    required
                  />
                  <label className="block text-earth-primary font-semibold">Cash Savings</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                    type="number"
                    placeholder="Cash Savings"
                    value={checkinForm.cash_savings}
                    onChange={(e) =>
                      setCheckinForm((f) => ({ ...f, cash_savings: e.target.value }))
                    }
                    required
                  />
                  <label className="block text-earth-primary font-semibold">Debt Amount</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                    type="number"
                    placeholder="Debt Amount"
                    value={checkinForm.debt_amount}
                    onChange={(e) => setCheckinForm((f) => ({ ...f, debt_amount: e.target.value }))}
                    required
                  />
                  <button
                    className="w-full mt-2 py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
                    type="submit"
                  >
                    Save Check-in
                  </button>
                  {checkinResult && (
                    <div
                      className={`p-2 rounded mt-2 text-center ${checkinResult.success ? 'bg-earth-accent2' : 'bg-earth-accent2'} text-earth`}
                    >
                      {checkinResult.message}
                    </div>
                  )}
                </form>
              </div>
              <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
                <h2 className="text-xl font-bold mb-4 text-earth-accent2 text-center flex items-center gap-2">
                  Add Asset/Transaction
                </h2>
                {step === 'select' && (
                  <div className="flex flex-col items-center w-full">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                      {categories.map((cat) => (
                        <button
                          key={cat.key}
                          className="py-2 px-4 rounded-lg bg-earth-accent text-earth font-semibold text-base shadow hover:bg-earth-accent2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-accent"
                          onClick={() => handleCategorySelect(cat.key)}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 'form' && category === 'crypto' && (
                  <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleCryptoSubmit}>
                    <h3 className="text-base font-semibold mb-1 text-earth-primary">
                      Add Crypto Transaction
                    </h3>
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Ticker Code"
                      value={cryptoForm.ticker_code}
                      onChange={(e) =>
                        setCryptoForm((f) => ({
                          ...f,
                          ticker_code: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Order Date"
                      type="date"
                      value={cryptoForm.order_date}
                      onChange={(e) =>
                        setCryptoForm((f) => ({
                          ...f,
                          order_date: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Units Delta"
                      value={cryptoForm.units_delta}
                      onChange={(e) =>
                        setCryptoForm((f) => ({
                          ...f,
                          units_delta: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Unit Price"
                      value={cryptoForm.unit_price}
                      onChange={(e) =>
                        setCryptoForm((f) => ({
                          ...f,
                          unit_price: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Fee"
                      value={cryptoForm.fee}
                      onChange={(e) => setCryptoForm((f) => ({ ...f, fee: e.target.value }))}
                    />
                    <button
                      className="w-full mt-2 py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
                      type="submit"
                    >
                      Add
                    </button>
                  </form>
                )}
                {step === 'form' && category === 'etf' && (
                  <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleEtfSubmit}>
                    <h3 className="text-base font-semibold mb-1 text-earth-primary">
                      Add ETF Transaction
                    </h3>
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Ticker"
                      value={etfForm.ticker}
                      onChange={(e) => setEtfForm((f) => ({ ...f, ticker: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Order Date"
                      type="date"
                      value={etfForm.order_date}
                      onChange={(e) => setEtfForm((f) => ({ ...f, order_date: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Units Delta"
                      value={etfForm.units_delta}
                      onChange={(e) => setEtfForm((f) => ({ ...f, units_delta: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Order Price"
                      value={etfForm.order_price}
                      onChange={(e) => setEtfForm((f) => ({ ...f, order_price: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Brokerage"
                      value={etfForm.brokerage}
                      onChange={(e) => setEtfForm((f) => ({ ...f, brokerage: e.target.value }))}
                    />
                    <button
                      className="w-full mt-2 py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
                      type="submit"
                    >
                      Add
                    </button>
                  </form>
                )}
                {step === 'form' && category === 'stock' && (
                  <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleStockSubmit}>
                    <h3 className="text-base font-semibold mb-1 text-earth-primary">
                      Add Stock Transaction
                    </h3>
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Ticker"
                      value={stockForm.ticker}
                      onChange={(e) => setStockForm((f) => ({ ...f, ticker: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Purchase Date"
                      type="date"
                      value={stockForm.purchase_date}
                      onChange={(e) =>
                        setStockForm((f) => ({
                          ...f,
                          purchase_date: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Volume"
                      value={stockForm.volume}
                      onChange={(e) => setStockForm((f) => ({ ...f, volume: e.target.value }))}
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Bought Price (AUD)"
                      value={stockForm.bought_price_aud}
                      onChange={(e) =>
                        setStockForm((f) => ({
                          ...f,
                          bought_price_aud: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                      placeholder="Brokerage"
                      value={stockForm.brokerage}
                      onChange={(e) => setStockForm((f) => ({ ...f, brokerage: e.target.value }))}
                    />
                    <button
                      className="w-full mt-2 py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
                      type="submit"
                    >
                      Add
                    </button>
                  </form>
                )}
                {step === 'result' && result && (
                  <div
                    className={`p-4 rounded-lg ${result.success ? 'bg-earth-accent2' : 'bg-earth-accent2'} text-earth mb-4 shadow`}
                  >
                    {result.message}
                  </div>
                )}
                {step === 'result' && (
                  <button
                    className="w-full py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
                    onClick={handleReset}
                  >
                    Add Another
                  </button>
                )}
              </div>
            </div>
            {/* Live Prices Section */}
            <div className="mt-8">
              <LivePrices />
            </div>
            {/* Asset Performance: full width */}
            <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center w-full mt-4 border border-earth text-earth">
              <h2 className="text-2xl font-bold mb-4 text-earth-accent3 text-center flex items-center gap-2">
                Asset Performance
              </h2>
              <div className="flex flex-row gap-8 overflow-x-auto">
                {assetsData.map((asset, idx) => (
                  <div key={idx} className="min-w-[320px] flex-1">
                    <AssetLineChart data={asset.data} title={asset.title} color={asset.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Add getServerSideProps to fetch data
export async function getServerSideProps() {
  // Fetch all data in parallel
  const [
    { data: rawBudgetItems = [] },
    { data: superSnapshots = [] },
    { data: cryptoTransactions = [] },
    { data: etfTransactions = [] },
    { data: stockTransactions = [] },
  ] = await Promise.all([
    supabase.from('budget_items').select('item, percent_allocation, monthly_amount, category'),
    supabase.from('super_snapshots').select('date, total_value').order('date', { ascending: true }),
    supabase.from('crypto_transactions').select('order_date, units_delta, unit_price'),
    supabase.from('etf_transactions').select('order_date, units_delta, order_price'),
    supabase.from('stock_transactions').select('purchase_date, volume, bought_price_aud'),
  ]);

  // Helper function to accumulate transaction values
  const accumulateTransactions = (
    transactions: Record<string, number | string>[],
    dateKey: string,
    unitsKey: string,
    priceKey: string
  ) => {
    let cumulative = 0;
    return (transactions ?? []).map((tx: Record<string, number | string>) => ({
      date: String(tx[dateKey]),
      amount: parseFloat((cumulative += Number(tx[unitsKey]) * Number(tx[priceKey])).toFixed(2)),
    }));
  };

  // Process asset data
  const assetsData = [
    {
      title: 'Super',
      data: (superSnapshots ?? []).map((snap: { date: string; total_value: number }) => ({
        date: snap.date,
        amount: snap.total_value,
      })),
      color: '#06D6A0',
    },
    {
      title: 'Crypto',
      data: accumulateTransactions(
        cryptoTransactions ?? [],
        'order_date',
        'units_delta',
        'unit_price'
      ),
      color: '#F72585',
    },
    {
      title: 'ETF',
      data: accumulateTransactions(
        etfTransactions ?? [],
        'order_date',
        'units_delta',
        'order_price'
      ),
      color: '#7C3AED',
    },
    {
      title: 'Stocks',
      data: accumulateTransactions(
        stockTransactions ?? [],
        'purchase_date',
        'volume',
        'bought_price_aud'
      ),
      color: '#FFD600',
    },
  ];

  // Net worth data for pie chart
  const netWorthData = assetsData.map((asset) => ({
    name: asset.title,
    value: asset.data.length > 0 ? asset.data[asset.data.length - 1].amount : 0,
  }));

  const props = {
    netWorthData,
    assetsData,
  };

  return { props };
}

import { useState } from 'react';
import BudgetSummary from '@/components/Dashboard/BudgetSummary';
import NetWorthPie from '@/components/Dashboard/NetWorthPie';
import AssetLineChart from '@/components/Dashboard/AssetLineChart';
import { supabase } from '@/utils/supabaseClient';

const categories = [
  { key: 'crypto', label: 'Crypto' },
  { key: 'etf', label: 'ETF' },
  { key: 'stock', label: 'Stock' },
  { key: 'super', label: 'Super' },
];

// Add types for props
interface AssetData {
  title: string;
  data: any[];
  color?: string;
}

interface DashboardProps {
  budgetItems: any[];
  netWorthData: any[];
  assetsData: AssetData[];
  budgetByCategory: any[];
}

export default function Dashboard({
  budgetItems = [],
  netWorthData = [],
  assetsData = [],
  budgetByCategory = [],
}: DashboardProps) {
  // Asset adder app state
  const [step, setStep] = useState<'select' | 'form' | 'result'>('select');
  const [category, setCategory] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [cryptoForm, setCryptoForm] = useState({ ticker_code: '', order_date: '', units_delta: '', unit_price: '', fee: '' });
  const [etfForm, setEtfForm] = useState({ ticker: '', order_date: '', units_delta: '', order_price: '', brokerage: '' });
  const [stockForm, setStockForm] = useState({ ticker: '', purchase_date: '', volume: '', bought_price_aud: '', brokerage: '' });
  const [superForm, setSuperForm] = useState({ date: '', voluntary_contributions: '', employer_contributions: '', total_value: '' });

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setTimeout(() => setStep('form'), 400);
  };
  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker_code, order_date, units_delta, unit_price, fee } = cryptoForm;
    const { error } = await supabase.from('crypto_transactions').insert([
      { ticker_code, order_date, units_delta: Number(units_delta), unit_price: Number(unit_price), fee: Number(fee) },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'Crypto transaction added!' });
    setStep('result');
  };
  const handleEtfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker, order_date, units_delta, order_price, brokerage } = etfForm;
    const { error } = await supabase.from('etf_transactions').insert([
      { ticker, order_date, units_delta: Number(units_delta), order_price: Number(order_price), brokerage: Number(brokerage) },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'ETF transaction added!' });
    setStep('result');
  };
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ticker, purchase_date, volume, bought_price_aud, brokerage } = stockForm;
    const { error } = await supabase.from('stock_transactions').insert([
      { ticker, purchase_date, volume: Number(volume), bought_price_aud: Number(bought_price_aud), brokerage: Number(brokerage) },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'Stock transaction added!' });
    setStep('result');
  };
  const handleSuperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { date, voluntary_contributions, employer_contributions, total_value } = superForm;
    const { error } = await supabase.from('super_snapshots').insert([
      { date, voluntary_contributions: Number(voluntary_contributions), employer_contributions: Number(employer_contributions), total_value: Number(total_value) },
    ]);
    if (error) setResult({ success: false, message: error.message });
    else setResult({ success: true, message: 'Super snapshot added!' });
    setStep('result');
  };
  const handleReset = () => {
    setStep('select');
    setCategory(null);
    setResult(null);
    setCryptoForm({ ticker_code: '', order_date: '', units_delta: '', unit_price: '', fee: '' });
    setEtfForm({ ticker: '', order_date: '', units_delta: '', order_price: '', brokerage: '' });
    setStockForm({ ticker: '', purchase_date: '', volume: '', bought_price_aud: '', brokerage: '' });
    setSuperForm({ date: '', voluntary_contributions: '', employer_contributions: '', total_value: '' });
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#18181B] via-[#23234b] to-[#1a1a2e] py-10 px-2">
      <div className="w-full max-w-6xl flex flex-col gap-12 px-2">
        <h1 className="text-4xl font-extrabold text-center text-sky-100 mb-6 tracking-tight drop-shadow">Insanity Dashboard</h1>
        {/* Top grid: Pie + Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <NetWorthPie data={netWorthData} title="Net Worth Breakdown" />
          <NetWorthPie data={budgetByCategory} title="Budget Breakdown" />
        </div>
        {/* Add Asset/Transaction */}
        <section className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-4 text-pink-400 text-center">Add Asset/Transaction</h2>
          {step === 'select' && (
            <div className="flex flex-col items-center w-full">
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    className="py-2 px-4 rounded-lg bg-sky-500 text-white font-semibold text-base shadow hover:bg-sky-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              <h3 className="text-base font-semibold mb-1 text-sky-400">Add Crypto Transaction</h3>
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Ticker Code" value={cryptoForm.ticker_code} onChange={e => setCryptoForm(f => ({ ...f, ticker_code: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Order Date" type="date" value={cryptoForm.order_date} onChange={e => setCryptoForm(f => ({ ...f, order_date: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Units Delta" value={cryptoForm.units_delta} onChange={e => setCryptoForm(f => ({ ...f, units_delta: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Unit Price" value={cryptoForm.unit_price} onChange={e => setCryptoForm(f => ({ ...f, unit_price: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Fee" value={cryptoForm.fee} onChange={e => setCryptoForm(f => ({ ...f, fee: e.target.value }))} />
              <button className="w-full mt-2 py-2 px-4 rounded bg-sky-500 text-white font-bold hover:bg-sky-600 transition" type="submit">Add</button>
            </form>
          )}
          {step === 'form' && category === 'etf' && (
            <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleEtfSubmit}>
              <h3 className="text-base font-semibold mb-1 text-sky-400">Add ETF Transaction</h3>
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Ticker" value={etfForm.ticker} onChange={e => setEtfForm(f => ({ ...f, ticker: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Order Date" type="date" value={etfForm.order_date} onChange={e => setEtfForm(f => ({ ...f, order_date: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Units Delta" value={etfForm.units_delta} onChange={e => setEtfForm(f => ({ ...f, units_delta: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Order Price" value={etfForm.order_price} onChange={e => setEtfForm(f => ({ ...f, order_price: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Brokerage" value={etfForm.brokerage} onChange={e => setEtfForm(f => ({ ...f, brokerage: e.target.value }))} />
              <button className="w-full mt-2 py-2 px-4 rounded bg-sky-500 text-white font-bold hover:bg-sky-600 transition" type="submit">Add</button>
            </form>
          )}
          {step === 'form' && category === 'stock' && (
            <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleStockSubmit}>
              <h3 className="text-base font-semibold mb-1 text-sky-400">Add Stock Transaction</h3>
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Ticker" value={stockForm.ticker} onChange={e => setStockForm(f => ({ ...f, ticker: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Purchase Date" type="date" value={stockForm.purchase_date} onChange={e => setStockForm(f => ({ ...f, purchase_date: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Volume" value={stockForm.volume} onChange={e => setStockForm(f => ({ ...f, volume: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Bought Price (AUD)" value={stockForm.bought_price_aud} onChange={e => setStockForm(f => ({ ...f, bought_price_aud: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Brokerage" value={stockForm.brokerage} onChange={e => setStockForm(f => ({ ...f, brokerage: e.target.value }))} />
              <button className="w-full mt-2 py-2 px-4 rounded bg-sky-500 text-white font-bold hover:bg-sky-600 transition" type="submit">Add</button>
            </form>
          )}
          {step === 'form' && category === 'super' && (
            <form className="space-y-3 w-full max-w-md mx-auto" onSubmit={handleSuperSubmit}>
              <h3 className="text-base font-semibold mb-1 text-sky-400">Add Super Snapshot</h3>
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Date" type="date" value={superForm.date} onChange={e => setSuperForm(f => ({ ...f, date: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Voluntary Contributions" value={superForm.voluntary_contributions} onChange={e => setSuperForm(f => ({ ...f, voluntary_contributions: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Employer Contributions" value={superForm.employer_contributions} onChange={e => setSuperForm(f => ({ ...f, employer_contributions: e.target.value }))} />
              <input className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Total Value" value={superForm.total_value} onChange={e => setSuperForm(f => ({ ...f, total_value: e.target.value }))} />
              <button className="w-full mt-2 py-2 px-4 rounded bg-sky-500 text-white font-bold hover:bg-sky-600 transition" type="submit">Add</button>
            </form>
          )}
          {step === 'result' && result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-600' : 'bg-red-600'} text-white mb-4 shadow`}>{result.message}</div>
          )}
          {step === 'result' && (
            <button className="w-full py-2 px-4 rounded bg-sky-500 text-white font-bold hover:bg-sky-600 transition" onClick={handleReset}>Add Another</button>
          )}
        </section>
        {/* Bottom grid: Budget Summary + Asset Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BudgetSummary budgetItems={budgetItems} title="Budget Summary" withBadges />
          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Asset Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {assetsData.map((asset, idx) => (
                <AssetLineChart key={idx} data={asset.data} title={asset.title} color={asset.color} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Add getServerSideProps to fetch data
export async function getServerSideProps() {
  const { data: rawBudgetItems } = await supabase
    .from('budget_items')
    .select('item, percent_allocation, monthly_amount, category');

  const budgetItems = (rawBudgetItems ?? []).map((b: any) => ({
    name: b.item,
    percentage: b.percent_allocation,
    amount: Number(b.monthly_amount),
    category: b.category,
  }));

  const filteredBudgetItems = budgetItems.filter(
    (item: any) => item.category && !isNaN(item.amount) && item.amount > 0
  );

  const budgetByCategoryMap: Record<string, number> = {};
  filteredBudgetItems.forEach((item: any) => {
    budgetByCategoryMap[item.category] =
      (budgetByCategoryMap[item.category] || 0) + item.amount;
  });
  const budgetByCategory = Object.entries(budgetByCategoryMap).map(
    ([name, value]) => ({ name, value })
  );

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const fetchData = async (table: string, dateCol: string, cols: string) => {
    const { data } = await supabase
      .from(table)
      .select(cols)
      .gte(dateCol, oneYearAgo.toISOString().split('T')[0])
      .order(dateCol, { ascending: true });
    return data ?? [];
  };

  const [
    superSnapshots,
    cryptoTransactions,
    etfTransactions,
    stockTransactions,
  ] = await Promise.all([
    fetchData('super_snapshots', 'date', 'date,total_value'),
    fetchData(
      'crypto_transactions',
      'order_date',
      'order_date,units_delta,unit_price'
    ),
    fetchData(
      'etf_transactions',
      'order_date',
      'order_date,units_delta,order_price'
    ),
    fetchData(
      'stock_transactions',
      'purchase_date',
      'purchase_date,volume,bought_price_aud'
    ),
  ]);

  const accumulateTransactions = (
    transactions: any[],
    dateKey: string,
    unitsKey: string,
    priceKey: string
  ) => {
    let cumulative = 0;
    return (transactions ?? []).map((tx) => ({
      date: tx[dateKey],
      amount: parseFloat((cumulative += tx[unitsKey] * tx[priceKey]).toFixed(2)),
    }));
  };

  const assetsData: AssetData[] = [
    {
      title: 'Super',
      data: (superSnapshots ?? []).map((snap: any) => ({
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

  return {
    props: {
      budgetItems,
      netWorthData,
      assetsData,
      budgetByCategory,
    },
  };
}

import { useState } from 'react';
import BudgetSummary from '@/components/Dashboard/BudgetSummary';
import NetWorthPie from '@/components/Dashboard/NetWorthPie';
import AssetLineChart from '@/components/Dashboard/AssetLineChart';
import CryptoForm from '@/components/forms/CryptoForm';
import EtfForm from '@/components/forms/EtfForm';
import StockForm from '@/components/forms/StockForm';
import { supabase } from '@/utils/supabaseClient';

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

interface BudgetItem {
  name: string;
  percentage: number;
  amount: number;
  category: string;
}

interface NetWorthDatum {
  name: string;
  value: number;
}

interface BudgetCategory {
  name: string;
  value: number;
}

interface DashboardProps {
  budgetItems: BudgetItem[];
  netWorthData: NetWorthDatum[];
  assetsData: AssetData[];
  budgetByCategory: BudgetCategory[];
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
  // Add Monthly Check-in form state
  const [checkinForm, setCheckinForm] = useState({
    super_amount: '',
    date: '',
    super_type: 'voluntary',
    cash_savings: '',
    debt_amount: '',
  });
  const [checkinResult, setCheckinResult] = useState<null | {
    success: boolean;
    message: string;
  }>(null);
  // Add state for collapsible Budget Summary
  const [budgetCollapsed, setBudgetCollapsed] = useState(true);
  const visibleBudgetItems = budgetCollapsed
    ? budgetItems.slice(0, 5)
    : budgetItems;

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setTimeout(() => setStep('form'), 400);
  };
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
    const { super_amount, date, super_type, cash_savings, debt_amount } =
      checkinForm;
    const { error } = await supabase.from('monthly_checkins').insert([
      {
        super_amount: Number(super_amount),
        date,
        super_type,
        cash_savings: Number(cash_savings),
        debt_amount: Number(debt_amount),
      },
    ]);
    if (error) setCheckinResult({ success: false, message: error.message });
    else
      setCheckinResult({ success: true, message: 'Monthly check-in saved!' });
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-earth-background text-earth py-10 px-4 lg:px-8">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-row gap-12 px-2 lg:px-6">
        {/* Sidebar: Budget Summary */}
        <aside className="hidden xl:flex flex-col w-[340px] min-w-[300px] max-w-[380px] h-[calc(100vh-60px)] sticky top-8 bg-earth-card rounded-2xl shadow-2xl p-6 mr-8 border border-earth text-earth">
          <div className="sticky top-0 z-10 bg-earth-card pb-2">
            <h2 className="text-2xl font-extrabold text-earth-primary mb-4 tracking-tight drop-shadow flex items-center gap-2">
              <span>Budget Summary</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <BudgetSummary
              budgetItems={visibleBudgetItems}
              title=""
              withBadges
            />
            {budgetItems.length > 5 && (
              <button
                className="mt-4 py-1 px-4 rounded bg-earth-accent text-earth font-semibold hover:bg-earth-accent2 transition self-center"
                onClick={() => setBudgetCollapsed((c) => !c)}
              >
                {budgetCollapsed ? 'Show More' : 'Show Less'}
              </button>
            )}
          </div>
        </aside>
        {/* Main Content Grid */}
        <div className="flex-1 flex flex-col gap-10">
          <h1 className="text-4xl font-extrabold text-center text-earth-primary mb-6 tracking-tight drop-shadow">
            Insanity Dashboard
          </h1>
          {/* Top row: 4 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
              <h2 className="text-xl font-bold mb-4 text-earth-primary text-center flex items-center gap-2">
                Net Worth Breakdown
              </h2>
              <NetWorthPie data={netWorthData} title="" />
            </div>
            <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
              <h2 className="text-xl font-bold mb-4 text-earth-primary text-center flex items-center gap-2">
                Budget Breakdown
              </h2>
              <NetWorthPie data={budgetByCategory} title="" />
            </div>
            <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
              <h2 className="text-xl font-bold mb-4 text-earth-accent text-center flex items-center gap-2">
                Monthly Check-in
              </h2>
              <form
                className="space-y-3 w-full max-w-lg mx-auto"
                onSubmit={handleCheckinSubmit}
              >
                <label className="block text-earth-primary font-semibold">
                  Super Amount
                </label>
                <input
                  className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                  type="number"
                  placeholder="Super Amount"
                  value={checkinForm.super_amount}
                  onChange={(e) =>
                    setCheckinForm((f) => ({
                      ...f,
                      super_amount: e.target.value,
                    }))
                  }
                  required
                />
                <label className="block text-earth-primary font-semibold">
                  Date
                </label>
                <input
                  className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                  type="date"
                  value={checkinForm.date}
                  onChange={(e) =>
                    setCheckinForm((f) => ({ ...f, date: e.target.value }))
                  }
                  required
                />
                <label className="block text-earth-primary font-semibold">
                  Super Type
                </label>
                <select
                  className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                  value={checkinForm.super_type}
                  onChange={(e) =>
                    setCheckinForm((f) => ({
                      ...f,
                      super_type: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="voluntary">Voluntary</option>
                  <option value="compulsory">Compulsory</option>
                </select>
                <label className="block text-earth-primary font-semibold">
                  Current Cash Savings
                </label>
                <input
                  className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                  type="number"
                  placeholder="Cash Savings"
                  value={checkinForm.cash_savings}
                  onChange={(e) =>
                    setCheckinForm((f) => ({
                      ...f,
                      cash_savings: e.target.value,
                    }))
                  }
                  required
                />
                <label className="block text-earth-primary font-semibold">
                  Current Debt Amount
                </label>
                <input
                  className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
                  type="number"
                  placeholder="Debt Amount"
                  value={checkinForm.debt_amount}
                  onChange={(e) =>
                    setCheckinForm((f) => ({
                      ...f,
                      debt_amount: e.target.value,
                    }))
                  }
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
                <CryptoForm
                  form={cryptoForm}
                  setForm={setCryptoForm}
                  onSubmit={handleCryptoSubmit}
                />
              )}
              {step === 'form' && category === 'etf' && (
                <EtfForm
                  form={etfForm}
                  setForm={setEtfForm}
                  onSubmit={handleEtfSubmit}
                />
              )}
              {step === 'form' && category === 'stock' && (
                <StockForm
                  form={stockForm}
                  setForm={setStockForm}
                  onSubmit={handleStockSubmit}
                />
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
          {/* Asset Performance: full width */}
          <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center w-full mt-4 border border-earth text-earth">
            <h2 className="text-2xl font-bold mb-4 text-earth-accent3 text-center flex items-center gap-2">
              Asset Performance
            </h2>
            <div className="flex flex-row gap-8 overflow-x-auto">
              {assetsData.map((asset, idx) => (
                <div key={idx} className="min-w-[320px] flex-1">
                  <AssetLineChart
                    data={asset.data}
                    title={asset.title}
                    color={asset.color}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add getServerSideProps to fetch data
export async function getServerSideProps() {
  console.log('Starting data fetch...');

  // Test database connection and list all tables
  console.log('\n=== Testing Database Connection ===');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  console.log('Available tables:', tables);
  console.log('Tables error:', tablesError);

  // Test a simple query on each table
  console.log('\n=== Testing Table Access ===');
  const testQueries = [
    supabase.from('budget_items').select('count'),
    supabase.from('super_snapshots').select('count'),
    supabase.from('crypto_transactions').select('count'),
    supabase.from('etf_transactions').select('count'),
    supabase.from('stock_transactions').select('count'),
  ];

  const testResults = await Promise.all(testQueries);
  console.log('Table counts:', {
    budget_items: testResults[0].data,
    super_snapshots: testResults[1].data,
    crypto_transactions: testResults[2].data,
    etf_transactions: testResults[3].data,
    stock_transactions: testResults[4].data,
  });

  // Helper function to accumulate transaction values
  const accumulateTransactions = (
    transactions: Record<string, number | string>[],
    dateKey: string,
    unitsKey: string,
    priceKey: string
  ) => {
    let cumulative = 0;
    const result = (transactions ?? []).map((tx) => ({
      date: String(tx[dateKey]),
      amount: parseFloat(
        (cumulative += Number(tx[unitsKey]) * Number(tx[priceKey])).toFixed(2)
      ),
    }));
    console.log('Accumulated transactions:', { transactions, result });
    return result;
  };

  // Fetch all data in parallel
  console.log('Fetching data from Supabase...');
  const [
    { data: rawBudgetItems, error: budgetError },
    { data: superSnapshots, error: superError },
    { data: cryptoTransactions, error: cryptoError },
    { data: etfTransactions, error: etfError },
    { data: stockTransactions, error: stockError },
  ] = await Promise.all([
    supabase
      .from('budget_items')
      .select('item, percent_allocation, monthly_amount, category'),
    supabase
      .from('super_snapshots')
      .select('date, total_value')
      .order('date', { ascending: true }),
    supabase
      .from('crypto_transactions')
      .select('order_date, units_delta, unit_price')
      .order('order_date', { ascending: true }),
    supabase
      .from('etf_transactions')
      .select('order_date, units_delta, order_price')
      .order('order_date', { ascending: true }),
    supabase
      .from('stock_transactions')
      .select('purchase_date, volume, bought_price_aud')
      .order('purchase_date', { ascending: true }),
  ]);

  // Log raw data and any errors
  console.log('\n=== Raw Data from Database ===');
  console.log('Budget Items:', JSON.stringify(rawBudgetItems, null, 2));
  console.log('Super Snapshots:', JSON.stringify(superSnapshots, null, 2));
  console.log(
    'Crypto Transactions:',
    JSON.stringify(cryptoTransactions, null, 2)
  );
  console.log('ETF Transactions:', JSON.stringify(etfTransactions, null, 2));
  console.log(
    'Stock Transactions:',
    JSON.stringify(stockTransactions, null, 2)
  );

  console.log('\n=== Any Errors ===');
  if (budgetError) console.error('Budget items error:', budgetError);
  if (superError) console.error('Super snapshots error:', superError);
  if (cryptoError) console.error('Crypto transactions error:', cryptoError);
  if (etfError) console.error('ETF transactions error:', etfError);
  if (stockError) console.error('Stock transactions error:', stockError);

  // Transform budget items
  console.log('\n=== Transforming Data ===');
  const budgetItems = (rawBudgetItems ?? []).map(
    (b: {
      item: string;
      percent_allocation: number;
      monthly_amount: number;
      category: string;
    }) => ({
      name: b.item,
      percentage: b.percent_allocation,
      amount: b.monthly_amount,
      category: b.category,
    })
  );
  console.log(
    'Transformed budget items:',
    JSON.stringify(budgetItems, null, 2)
  );

  const filteredBudgetItems = budgetItems.filter(
    (item: BudgetItem) =>
      item.category && !isNaN(item.amount) && item.amount > 0
  );
  console.log(
    'Filtered budget items:',
    JSON.stringify(filteredBudgetItems, null, 2)
  );

  const budgetByCategoryMap: Record<string, number> = {};
  filteredBudgetItems.forEach((item: BudgetItem) => {
    budgetByCategoryMap[item.category] =
      (budgetByCategoryMap[item.category] || 0) + item.amount;
  });
  const budgetByCategory = Object.entries(budgetByCategoryMap).map(
    ([name, value]) => ({ name, value })
  );
  console.log('Budget by category:', JSON.stringify(budgetByCategory, null, 2));

  // Process asset data
  console.log('\n=== Processing Asset Data ===');
  const assetsData: AssetData[] = [
    {
      title: 'Super',
      data: (superSnapshots ?? []).map((snap) => ({
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
  console.log('Processed assets data:', JSON.stringify(assetsData, null, 2));

  // Net worth data for pie chart
  const netWorthData = assetsData.map((asset) => ({
    name: asset.title,
    value: asset.data.length > 0 ? asset.data[asset.data.length - 1].amount : 0,
  }));
  console.log('Net worth data:', JSON.stringify(netWorthData, null, 2));

  console.log('\n=== Final Props ===');
  const props = {
    budgetItems: filteredBudgetItems,
    netWorthData,
    assetsData,
    budgetByCategory,
  };
  console.log('Props being returned:', JSON.stringify(props, null, 2));

  return { props };
}

import { supabase } from "@/utils/supabaseClient";
import BudgetSummary from "@/components/Dashboard/BudgetSummary";
import NetWorthPie from "@/components/Dashboard/NetWorthPie";
import AssetLineChart from "@/components/Dashboard/AssetLineChart";
import { BanknotesIcon, CurrencyDollarIcon, ChartBarIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

const assetIcons = {
  Super: <BanknotesIcon className="w-6 h-6 text-accent" />,
  Crypto: <CurrencyDollarIcon className="w-6 h-6 text-neon" />,
  ETF: <ChartBarIcon className="w-6 h-6 text-primary" />,
  Stocks: <RocketLaunchIcon className="w-6 h-6 text-yellow-400" />,
};

const assetColors = {
  Super: '#06D6A0', // accent
  Crypto: '#F72585', // neon
  ETF: '#7C3AED', // primary
  Stocks: '#FFD600', // yellow
};

export default function DashboardPage({ budgetItems, netWorthData, assetsData, budgetByCategory }) {
  return (
    <div className="w-full h-full min-h-[90vh] flex flex-col gap-8 items-center justify-center">
      {/* Main dashboard area: two columns */}
      <div className="grid grid-cols-2 gap-10 w-full h-[60vh]">
        {/* Left column: stacked pie charts */}
        <div className="flex flex-col gap-8 h-full justify-between">
          <div className="rounded-2xl shadow-lg p-8 bg-[#18181B] border border-zinc-800 text-white flex-1 flex flex-col justify-center items-center min-h-[300px]">
            <NetWorthPie data={netWorthData || []} title="Net Worth Breakdown" large />
          </div>
          <div className="rounded-2xl shadow-lg p-8 bg-[#18181B] border border-zinc-800 text-white flex-1 flex flex-col justify-center items-center min-h-[300px]">
            <NetWorthPie data={budgetByCategory || []} title="Budget Breakdown" large />
          </div>
        </div>
        {/* Right column: budget summary */}
        <div className="rounded-2xl shadow-lg p-8 bg-[#18181B] border border-zinc-800 text-white h-full flex flex-col justify-between overflow-auto min-h-[620px]">
          <BudgetSummary budgetItems={budgetItems || []} title="Budget Summary" withBadges large />
        </div>
      </div>
      {/* Asset line charts row */}
      <div className="grid grid-cols-4 gap-8 w-full" style={{ minHeight: 300 }}>
        {assetsData.map((asset, idx) => (
          <div key={idx} className="rounded-2xl shadow-lg p-8 bg-[#18181B] border border-zinc-800 text-white flex flex-col gap-2 items-center justify-between h-full">
            <div className="flex items-center gap-2 mb-2">
              {assetIcons[asset.title]}
              <span className="font-bold text-lg text-accent drop-shadow">{asset.title}</span>
            </div>
            <AssetLineChart data={asset.data} title={asset.title} color={assetColors[asset.title]} />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data: rawBudgetItems } = await supabase
    .from('budget_items')
    .select('item, percent_allocation, monthly_amount, category');

  const budgetItems = rawBudgetItems.map(b => ({
    name: b.item,
    percentage: b.percent_allocation,
    amount: Number(b.monthly_amount),
    category: b.category
  }));

  const filteredBudgetItems = budgetItems.filter(
    item => item.category && !isNaN(item.amount) && item.amount > 0
  );

  const budgetByCategoryMap = {};
  filteredBudgetItems.forEach(item => {
    budgetByCategoryMap[item.category] = (budgetByCategoryMap[item.category] || 0) + item.amount;
  });
  const budgetByCategory = Object.entries(budgetByCategoryMap).map(([name, value]) => ({ name, value }));

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const fetchData = async (table, dateCol, cols) => {
    const { data } = await supabase
      .from(table)
      .select(cols)
      .gte(dateCol, oneYearAgo.toISOString().split('T')[0])
      .order(dateCol, { ascending: true });
    return data;
  };

  const [superSnapshots, cryptoTransactions, etfTransactions, stockTransactions] = await Promise.all([
    fetchData('super_snapshots', 'date', 'date,total_value'),
    fetchData('crypto_transactions', 'order_date', 'order_date,units_delta,unit_price'),
    fetchData('etf_transactions', 'order_date', 'order_date,units_delta,order_price'),
    fetchData('stock_transactions', 'purchase_date', 'purchase_date,volume,bought_price_aud'),
  ]);

  const accumulateTransactions = (transactions, dateKey, unitsKey, priceKey) => {
    let cumulative = 0;
    return transactions.map(tx => ({
      date: tx[dateKey],
      amount: parseFloat((cumulative += tx[unitsKey] * tx[priceKey]).toFixed(2))
    }));
  };

  const assetsData = [
    { title: "Super", data: superSnapshots.map(snap => ({ date: snap.date, amount: snap.total_value })) },
    { title: "Crypto", data: accumulateTransactions(cryptoTransactions, 'order_date', 'units_delta', 'unit_price') },
    { title: "ETF", data: accumulateTransactions(etfTransactions, 'order_date', 'units_delta', 'order_price') },
    { title: "Stocks", data: accumulateTransactions(stockTransactions, 'purchase_date', 'volume', 'bought_price_aud') },
  ];

  const netWorthData = assetsData.map(asset => ({
    name: asset.title,
    value: asset.data.slice(-1)[0]?.amount || 0,
  }));

  return { props: { budgetItems: budgetItems || [], netWorthData, assetsData, budgetByCategory } };
}

import Header from '@/components/Header';
import BudgetSummary from '@/components/Dashboard/BudgetSummary';
import NetWorthPie from '@/components/Dashboard/NetWorthPie';
import { supabase } from '@/utils/supabaseClient';
import { useState } from 'react';

interface BudgetItem {
  name: string;
  percentage: number;
  amount: number;
  category: string;
}

interface BudgetCategory {
  name: string;
  value: number;
}

interface BudgetPageProps {
  budgetItems: BudgetItem[];
  budgetByCategory: BudgetCategory[];
}

export default function Budget({ budgetItems = [], budgetByCategory = [] }: BudgetPageProps) {
  const [budgetCollapsed, setBudgetCollapsed] = useState(true);
  const visibleBudgetItems = budgetCollapsed ? budgetItems.slice(0, 5) : budgetItems;

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 flex flex-col xl:flex-row gap-8">
        {/* Sidebar: Budget Summary */}
        <aside className="w-full xl:w-[340px] min-w-[300px] max-w-[380px] bg-earth-card rounded-2xl shadow-2xl p-6 border border-earth text-earth mb-8 xl:mb-0">
          <div className="sticky top-0 z-10 bg-earth-card pb-2">
            <h2 className="text-2xl font-extrabold text-earth-primary mb-4 tracking-tight drop-shadow flex items-center gap-2">
              <span>Budget Summary</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <BudgetSummary budgetItems={visibleBudgetItems} title="" withBadges />
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
        {/* Main Content: Budget Breakdown Chart */}
        <div className="flex-1 flex flex-col gap-10">
          <h1 className="text-3xl font-semibold mb-2">Budget</h1>
          <p className="text-gray-600 mb-6">
            A clean visual view of your current budget breakdown.
          </p>
          <div className="bg-earth-card rounded-2xl shadow-card p-8 flex flex-col justify-center border border-earth text-earth">
            <h2 className="text-xl font-bold mb-4 text-earth-primary text-center flex items-center gap-2">
              Budget Breakdown
            </h2>
            <NetWorthPie data={budgetByCategory} title="" />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { data: rawBudgetItems = [] } = await supabase
    .from('budget_items')
    .select('item, percent_allocation, monthly_amount, category');

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

  const filteredBudgetItems = budgetItems.filter(
    (item: BudgetItem) => item.category && !isNaN(item.amount) && item.amount > 0
  );

  const budgetByCategoryMap: Record<string, number> = {};
  filteredBudgetItems.forEach((item: BudgetItem) => {
    budgetByCategoryMap[item.category] = (budgetByCategoryMap[item.category] || 0) + item.amount;
  });
  const budgetByCategory = Object.entries(budgetByCategoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    props: {
      budgetItems: filteredBudgetItems,
      budgetByCategory,
    },
  };
}

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';

interface BudgetItem {
  id: string;
  item: string;
  category: string;
  bank_account: string;
  percent_allocation: number;
  monthly_amount: number;
  weekly_amount: number;
  yearly_amount: number;
}

// Color palette for pie chart
const COLORS = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

export default function BudgetPlayground() {
  // State for monthly income and budget items
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch budget items from Supabase on mount
  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('budget_items').select('*');
      if (error) {
        setError('Failed to load budget items.');
      } else {
        setBudgetItems(data || []);
        // Optionally, infer monthly income from sum of items
        if (data && data.length > 0) {
          const total = data.reduce(
            (sum, item) => sum + (item.monthly_amount || 0),
            0
          );
          setMonthlyIncome(total);
        }
      }
      setLoading(false);
    };
    fetchBudget();
  }, []);

  // Calculate total allocated and remaining
  const totalAllocated = budgetItems.reduce(
    (sum, item) => sum + Number(item.monthly_amount || 0),
    0
  );
  const remaining = monthlyIncome - totalAllocated;

  // Handle input changes for amount or percent
  const handleItemChange = (
    idx: number,
    field: 'monthly_amount' | 'percent_allocation',
    value: number
  ) => {
    setBudgetItems((items) => {
      const updated = [...items];
      if (field === 'monthly_amount') {
        updated[idx].monthly_amount = value;
        updated[idx].percent_allocation = monthlyIncome
          ? (value / monthlyIncome) * 100
          : 0;
      } else {
        updated[idx].percent_allocation = value;
        updated[idx].monthly_amount = (monthlyIncome * value) / 100;
      }
      updated[idx].weekly_amount = updated[idx].monthly_amount / 4.345; // Approx weeks/month
      updated[idx].yearly_amount = updated[idx].monthly_amount * 12;
      return updated;
    });
  };

  // Add a new budget item
  const addBudgetItem = () => {
    setBudgetItems((items) => [
      ...items,
      {
        id: uuidv4(),
        item: '',
        percent_allocation: 0,
        monthly_amount: 0,
        weekly_amount: 0,
        yearly_amount: 0,
        bank_account: '',
        category: '',
      },
    ]);
  };

  // Remove a budget item
  const removeBudgetItem = (idx: number) => {
    setBudgetItems((items) => items.filter((_, i) => i !== idx));
  };

  // Save & Commit to Supabase (overwrites all)
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    // Remove empty items
    const filtered = budgetItems.filter(
      (item) => item.item && item.monthly_amount > 0
    );
    // Delete all existing, then insert new
    const { error: delError } = await supabase
      .from('budget_items')
      .delete()
      .neq('id', '');
    if (delError) {
      setError('Failed to clear old budget items.');
      setSaving(false);
      return;
    }
    const { error: insError } = await supabase
      .from('budget_items')
      .insert(filtered);
    if (insError) {
      setError('Failed to save new budget.');
    } else {
      setSuccess('Budget saved successfully!');
    }
    setSaving(false);
  };

  // Pie chart data
  const pieData = budgetItems
    .filter((item) => item.monthly_amount > 0)
    .map((item) => ({
      name: item.item,
      value: Number(item.monthly_amount),
    }));

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-[#111827]">
      <div className="w-full max-w-5xl bg-[#18181B] border border-zinc-800 text-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-accent">
          Budget Playground
        </h1>
        {/* Monthly Income Input */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <label className="font-semibold text-lg text-white">
            Monthly Income:
          </label>
          <input
            type="number"
            className="border border-zinc-700 rounded px-4 py-2 w-48 text-lg font-bold bg-[#18181B] text-white"
            value={monthlyIncome}
            min={0}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          />
          <button
            className="ml-auto px-4 py-2 rounded bg-accent text-white font-bold hover:bg-brand transition"
            onClick={addBudgetItem}
            type="button"
          >
            + Add Item
          </button>
        </div>
        {/* Budget Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="text-white">
                <th className="text-left">Item</th>
                <th className="text-left">Category</th>
                <th className="text-left">Bank</th>
                <th className="text-right">%</th>
                <th className="text-right">$/mo</th>
                <th className="text-right">$/wk</th>
                <th className="text-right">$/yr</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.map((item, idx) => (
                <tr key={item.id} className="text-white">
                  <td>
                    <input
                      className="border border-zinc-700 rounded px-2 py-1 w-32 bg-[#18181B] text-white"
                      value={item.item}
                      onChange={(e) =>
                        setBudgetItems((items) => {
                          const updated = [...items];
                          updated[idx].item = e.target.value;
                          return updated;
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="border border-zinc-700 rounded px-2 py-1 w-24 bg-[#18181B] text-white"
                      value={item.category}
                      onChange={(e) =>
                        setBudgetItems((items) => {
                          const updated = [...items];
                          updated[idx].category = e.target.value;
                          return updated;
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="border border-zinc-700 rounded px-2 py-1 w-20 bg-[#18181B] text-white"
                      value={item.bank_account}
                      onChange={(e) =>
                        setBudgetItems((items) => {
                          const updated = [...items];
                          updated[idx].bank_account = e.target.value;
                          return updated;
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="border border-zinc-700 rounded px-2 py-1 w-16 text-right bg-[#18181B] text-white"
                      value={Number(item.percent_allocation).toFixed(2)}
                      min={0}
                      max={100}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          'percent_allocation',
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="border border-zinc-700 rounded px-2 py-1 w-20 text-right bg-[#18181B] text-white"
                      value={Number(item.monthly_amount).toFixed(2)}
                      min={0}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          'monthly_amount',
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="text-right">
                    {item.weekly_amount
                      ? `$${item.weekly_amount.toFixed(2)}`
                      : ''}
                  </td>
                  <td className="text-right">
                    {item.yearly_amount
                      ? `$${item.yearly_amount.toFixed(2)}`
                      : ''}
                  </td>
                  <td>
                    <button
                      className="text-red-500 font-bold px-2"
                      onClick={() => removeBudgetItem(idx)}
                      type="button"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Remaining Balance and Visual Feedback */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
          <div className="flex-1">
            <div className="mb-2 font-semibold text-lg text-white">
              Remaining:{' '}
              <span
                className={
                  remaining === 0
                    ? 'text-green-400'
                    : remaining < 0
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }
              >
                ${remaining.toFixed(2)}
              </span>
            </div>
            <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remaining < 0
                    ? 'bg-red-500'
                    : remaining === 0
                      ? 'bg-green-400'
                      : 'bg-yellow-400'
                }`}
                style={{
                  width: `${Math.min(100, ((monthlyIncome - remaining) / monthlyIncome) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
          {/* Pie Chart */}
          <div className="flex-1 min-w-[250px] h-56 bg-[#18181B] rounded-xl flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#18181B',
                    color: '#fff',
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Save & Commit Button */}
        <div className="flex items-center gap-4">
          <button
            className="px-6 py-3 rounded-lg bg-brand text-white font-bold text-lg hover:bg-accent transition disabled:opacity-50"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save & Commit'}
          </button>
          {error && <span className="text-red-400 font-semibold">{error}</span>}
          {success && (
            <span className="text-green-400 font-semibold">{success}</span>
          )}
        </div>
      </div>
    </div>
  );
}

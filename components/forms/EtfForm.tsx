import React from 'react';

interface EtfFormState {
  ticker: string;
  order_date: string;
  units_delta: string;
  order_price: string;
  brokerage: string;
}

interface EtfFormProps {
  form: EtfFormState;
  setForm: React.Dispatch<React.SetStateAction<EtfFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function EtfForm({ form, setForm, onSubmit, className }: EtfFormProps) {
  return (
    <form className={className ?? 'space-y-3 w-full max-w-md mx-auto'} onSubmit={onSubmit}>
      <h3 className="text-base font-semibold mb-1 text-earth-primary">Add ETF Transaction</h3>
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Ticker"
        value={form.ticker}
        onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        type="date"
        value={form.order_date}
        onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Units"
        value={form.units_delta}
        onChange={(e) => setForm((f) => ({ ...f, units_delta: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Order Price"
        value={form.order_price}
        onChange={(e) => setForm((f) => ({ ...f, order_price: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Brokerage"
        value={form.brokerage}
        onChange={(e) => setForm((f) => ({ ...f, brokerage: e.target.value }))}
      />
      <button
        className="w-full mt-2 py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}

import React from 'react';

interface StockFormState {
  ticker: string;
  purchase_date: string;
  volume: string;
  bought_price_aud: string;
  brokerage: string;
}

interface StockFormProps {
  form: StockFormState;
  setForm: React.Dispatch<React.SetStateAction<StockFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function StockForm({ form, setForm, onSubmit, className }: StockFormProps) {
  return (
    <form className={className ?? 'space-y-3 w-full max-w-md mx-auto'} onSubmit={onSubmit}>
      <h3 className="text-base font-semibold mb-1 text-earth-primary">Add Stock Transaction</h3>
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Ticker"
        value={form.ticker}
        onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        type="date"
        value={form.purchase_date}
        onChange={(e) => setForm((f) => ({ ...f, purchase_date: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Volume"
        value={form.volume}
        onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Bought Price (AUD)"
        value={form.bought_price_aud}
        onChange={(e) => setForm((f) => ({ ...f, bought_price_aud: e.target.value }))}
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

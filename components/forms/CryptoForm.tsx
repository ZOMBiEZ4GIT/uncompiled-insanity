import React from 'react';

interface CryptoFormState {
  ticker_code: string;
  order_date: string;
  units_delta: string;
  unit_price: string;
  fee: string;
}

interface CryptoFormProps {
  form: CryptoFormState;
  setForm: React.Dispatch<React.SetStateAction<CryptoFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function CryptoForm({ form, setForm, onSubmit, className }: CryptoFormProps) {
  return (
    <form className={className ?? 'space-y-3 w-full max-w-md mx-auto'} onSubmit={onSubmit}>
      <h3 className="text-base font-semibold mb-1 text-earth-primary">Add Crypto Transaction</h3>
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Ticker Code"
        value={form.ticker_code}
        onChange={(e) => setForm((f) => ({ ...f, ticker_code: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        type="date"
        placeholder="Order Date"
        value={form.order_date}
        onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Units Delta"
        value={form.units_delta}
        onChange={(e) => setForm((f) => ({ ...f, units_delta: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Unit Price"
        value={form.unit_price}
        onChange={(e) => setForm((f) => ({ ...f, unit_price: e.target.value }))}
      />
      <input
        className="w-full px-3 py-2 rounded border border-earth bg-earth-background text-earth focus:outline-none focus:ring-2 focus:ring-earth-accent"
        placeholder="Fee"
        value={form.fee}
        onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
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

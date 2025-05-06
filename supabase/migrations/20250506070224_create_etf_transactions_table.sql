-- Create etf_transactions table
CREATE TABLE public.etf_transactions (
  id           uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker       text    NOT NULL,
  order_date   date    NOT NULL,
  units_delta  numeric NOT NULL,
  order_price  numeric NOT NULL,
  brokerage    numeric NOT NULL
);

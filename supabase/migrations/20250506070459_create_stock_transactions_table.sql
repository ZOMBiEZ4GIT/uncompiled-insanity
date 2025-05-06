-- Create stock_transactions table
CREATE TABLE public.stock_transactions (
  id               uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker           text    NOT NULL,
  purchase_date    date    NOT NULL,
  volume           numeric NOT NULL,
  bought_price_aud numeric NOT NULL,
  brokerage        numeric NOT NULL
);

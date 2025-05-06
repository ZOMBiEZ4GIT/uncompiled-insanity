-- Create crypto_transactions table
CREATE TABLE public.crypto_transactions (
  id           uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker_code  text    NOT NULL,
  order_date   date    NOT NULL,
  units_delta  numeric NOT NULL,
  unit_price   numeric NOT NULL,
  fee          numeric NOT NULL
);

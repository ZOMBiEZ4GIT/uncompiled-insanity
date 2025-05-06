-- Enable UUID generation (only needs to run once)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the budget_items table
CREATE TABLE public.budget_items (
  id                uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  item              text    NOT NULL,
  percent_allocation numeric,
  monthly_amount    numeric NOT NULL,
  weekly_amount     numeric NOT NULL,
  yearly_amount     numeric NOT NULL,
  bank_account      text,
  category          text
);

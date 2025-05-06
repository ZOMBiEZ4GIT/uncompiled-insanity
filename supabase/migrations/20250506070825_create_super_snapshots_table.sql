-- Create super_snapshots table
CREATE TABLE public.super_snapshots (
  id            uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  date          date    NOT NULL,
  super_setting text    NOT NULL,
  contributions numeric,
  total_value   numeric,
  gain_amount   numeric,
  gain_percent  numeric
);

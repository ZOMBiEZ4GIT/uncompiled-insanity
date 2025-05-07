
# 📊 Supabase Database Structure Summary

This document outlines the schema and data imported into your Supabase project.

---

## 1. `budget_items`

**Purpose**: Stores monthly budget allocations per item.

| Field                | Type    | Notes                                |
|---------------------|---------|--------------------------------------|
| `id`                | uuid    | Primary key                          |
| `item`              | text    | Name of the budget line (e.g. Rent)  |
| `percent_allocation`| numeric | Calculated from Monthly / Total      |
| `monthly_amount`    | numeric | Fixed monthly value                  |
| `weekly_amount`     | numeric | Derived manually from monthly        |
| `yearly_amount`     | numeric | Derived manually from monthly        |
| `bank_account`      | text    | Bank it debits from                  |
| `category`          | text    | Logical category (e.g. Food, Bills)  |

✅ **Historical Data Imported**

---

## 2. `crypto_transactions`

**Purpose**: Records buy/sell orders for crypto assets.

| Field         | Type    | Notes                              |
|---------------|---------|------------------------------------|
| `id`          | uuid    | Primary key                        |
| `ticker_code` | text    | e.g. BTC, ETH                      |
| `order_date`  | date    | Format: YYYY-MM-DD                 |
| `units_delta` | numeric | Quantity bought/sold (+/-)         |
| `unit_price`  | numeric | Price per unit                     |
| `fee`         | numeric | Transaction fee                    |

✅ **Historical Data Imported**

---

## 3. `etf_transactions`

**Purpose**: Tracks purchases of ETF units over time.

| Field         | Type    | Notes                              |
|---------------|---------|------------------------------------|
| `id`          | uuid    | Primary key                        |
| `ticker`      | text    | ETF code (e.g. VAS, IVV)           |
| `order_date`  | date    | When the order was executed        |
| `units_delta` | numeric | Number of units bought             |
| `order_price` | numeric | Price per unit at purchase         |
| `brokerage`   | numeric | Fee charged per order              |

✅ **Historical Data Imported**

---

## 4. `stock_transactions`

**Purpose**: Tracks stock purchases over time.

| Field             | Type    | Notes                           |
|-------------------|---------|---------------------------------|
| `id`              | uuid    | Primary key                     |
| `ticker`          | text    | Stock code                      |
| `purchase_date`   | date    | When shares were bought         |
| `volume`          | numeric | Number of shares                |
| `bought_price_aud`| numeric | Purchase price in AUD           |
| `brokerage`       | numeric | Brokerage fee                   |

✅ **Historical Data Imported**

---

## 5. `super_snapshots`

**Purpose**: Tracks superannuation contributions and total value over time.

| Field                   | Type    | Notes                                      |
|-------------------------|---------|--------------------------------------------|
| `id`                    | uuid    | Primary key                                |
| `date`                  | date    | Snapshot date                              |
| `voluntary_contributions` | numeric | Voluntary contributions (e.g. after-tax)   |
| `employer_contributions`  | numeric | Employer contributions (e.g. SG)           |
| `total_value`           | numeric | Super balance at the snapshot date         |

✅ **Historical Data Imported** (based on cleaned and reformatted values)

---

-- Backs the rate-limiting added to create-booking (2026-07-26).
-- One row per booking attempt (successful or not) - the function
-- checks how many rows exist for a given phone/IP in the last window
-- before allowing another attempt through.

create table if not exists booking_rate_limit (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists booking_rate_limit_phone_created_idx
  on booking_rate_limit (phone, created_at);

create index if not exists booking_rate_limit_ip_created_idx
  on booking_rate_limit (ip, created_at);

-- Old rows are only ever useful for a ~15 minute lookback window, so
-- there's no reason to keep them forever. Run this occasionally (or
-- put it on a cron) to keep the table small.
-- delete from booking_rate_limit where created_at < now() - interval '1 day';

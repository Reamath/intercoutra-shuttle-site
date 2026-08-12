-- Enquiries table for the Next.js lead-gen site (intercoutra-site-v2).
-- Replaces the old bookings/trip_instances seat-holding system for the
-- new site - this just persists WhatsApp/enquiry-form leads for the team
-- to work through a simple status pipeline (new -> contacted -> quoted ->
-- booked/lost). SMS + email alerts still go out via the existing
-- create-enquiry Edge Function, called from the Next.js API route.
--
-- Run this once in the Supabase SQL editor.

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null check (service in ('airport', 'eswatini', 'soweto', 'cape-town')),
  travel_date date,
  passengers integer not null default 1,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'booked', 'lost')),
  source text not null default 'website',
  source_ip text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx on enquiries (status);
create index if not exists enquiries_phone_idx on enquiries (phone);

-- RLS enabled, no public policies - only the service role key (used
-- server-side in the Next.js API route and admin page) can read/write.
alter table enquiries enable row level security;

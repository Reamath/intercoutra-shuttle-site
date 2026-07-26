-- Extends trip_instances from 2026-08-10 through 2027-01-31.
-- 4 departures/day: Manzini<->Sandton, morning (05:00 UTC = 7AM SAST)
-- and afternoon (12:00 UTC = 2PM SAST), matching the existing pattern.
-- capacity is set to 5 (the Vito's real seat count), not the stale 6
-- default some older rows carry - see chat for context. vehicle_id is
-- left NULL, matching how most existing rows are (unassigned until
-- dispatch allocates one).

insert into trip_instances (route_id, origin_label, destination_label, departure_at, capacity, status)
select
  '20374411-3ca6-465f-aa02-81087129bb6b'::uuid,
  'Manzini - Riverside Mall',
  'Sandton - Gautrain Station',
  d + interval '5 hours',
  5,
  'scheduled'
from generate_series('2026-08-10'::date, '2027-01-31'::date, interval '1 day') as d

union all

select
  '20374411-3ca6-465f-aa02-81087129bb6b'::uuid,
  'Manzini - Riverside Mall',
  'Sandton - Gautrain Station',
  d + interval '12 hours',
  5,
  'scheduled'
from generate_series('2026-08-10'::date, '2027-01-31'::date, interval '1 day') as d

union all

select
  '20374411-3ca6-465f-aa02-81087129bb6b'::uuid,
  'Sandton - Gautrain Station',
  'Manzini - Riverside Mall',
  d + interval '5 hours',
  5,
  'scheduled'
from generate_series('2026-08-10'::date, '2027-01-31'::date, interval '1 day') as d

union all

select
  '20374411-3ca6-465f-aa02-81087129bb6b'::uuid,
  'Sandton - Gautrain Station',
  'Manzini - Riverside Mall',
  d + interval '12 hours',
  5,
  'scheduled'
from generate_series('2026-08-10'::date, '2027-01-31'::date, interval '1 day') as d;

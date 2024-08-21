-- create extension if not exists postgis;

CREATE EXTENSION postgis;

DO $$
begin
  if not exists (select 1 from pg_type where typname = 'location_type') then
    create type location_type as enum (
      'restaurant',
      'hotel',
      'park',
      'place',
    );
  end if;
end$$;

create table if not exists locations (
	      id serial primary key,
	    name varchar not null,
	    kind location_type not null default 'place',
     cords geom geometry(Point, 4326),
	 address text,
   created timestamp not null default current_timestamp,
);

-- insert into locations (name, geom, kind) values (
--     'Central Park',
--     'POINT(-122.34900 47.62058)',
--     'park');

-- insert into locations (name, cords, kind) values
--     ('San Francisco', ST_SetSRID(ST_MakePoint(-122.4074,  37.7879), 4326), 'place'),
--     ('New York'     , ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326), 'place');

-- Perform a spatial query to find points within a certain distance from a reference point
-- select name from locations
-- WHERE ST_DWithin(geom,
--   ST_SetSRID(ST_MakePoint(-122.4074, 37.7879), 4326), 100000); -- Within 100km of San Francisco
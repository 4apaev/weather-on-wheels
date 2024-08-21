DO $$
begin
  if not exists (select 1 from pg_type where typname = 'location_type') then
    create type location_type as enum (
      'restaurant',
      'hotel',
      'park',
      'place'
    );
  end if;
end$$;

create table if not exists locations (
    id      serial primary key,
    name    varchar not null,
    kind    location_type not null default 'place',
    lat     decimal not null,
    lng     decimal not null,
    address text,
    created timestamp not null default current_timestamp
);

insert into locations ("name", "lat", "lng", "kind") values ('Central Park      ', 40.78359213664584,  -73.96168137484973, 'park');
insert into locations ("name", "lat", "lng", "kind") values ('The StoneWall inn ', 40.73407594499908,  -74.00375157038864, 'hotel');
insert into locations ("name", "lat", "lng", "kind") values ('Washington Square ', 40.73119245239236,  -73.99844581014865, 'park');
insert into locations ("name", "lat", "lng", "kind") values ('Blue Note         ', 40.73109538342756,  -74.00084244230672, 'restaurant');
insert into locations ("name", "lat", "lng", "kind") values ('Magnolia Bakery   ', 40.736113875831926, -74.00397129132641, 'restaurant');
insert into locations ("name", "lat", "lng", "kind") values ('Madison Square    ', 40.74244925864747,  -73.98697446670772, 'park');
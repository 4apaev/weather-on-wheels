import Query, { where } from './db.js'

const TABLE = 'locations'

export { Query }

/**
 * @prop   { object } params
 * @return { Promise<QRes> }
 */
export const query = where(TABLE, 'name', 'address', 'lat', 'lng', 'kind')

/**
 * @prop   { string } name
 * @prop   { number } lat
 * @prop   { number } lng
 * @prop   { string } kind
 * @prop   { string } address
 * @return { Promise<QRes> }
 */
export function create({ name, lat, lng, kind, address }) {
    return Query(`
    insert into
        ${ TABLE }(name, lat, lng, kind, address)
           values($1, $2, $3, $4, $5);

    `, [ name, lat, lng, kind, address ])
}

/**
 * @prop   { string } id
 * @return { Promise<QRes> }
 */
export function get({ id }) {
    return Query(`
        select * from ${ TABLE }
            where
                id=$1
            limit
                1;
    `, [ id ])
}

/**
 * @prop   { number } [limit]
 * @return { Promise<QRes> }
 */
export function all({ limit }) {
    return Query(`
        select * from ${ TABLE }
            limit
                $1;
    `, [ limit ?? 10 ])
}

/** @typedef {import("./db.js").QRes} QRes */

/*
    id        serial primary key,
    name      varchar not null,
    kind      location_type not null default 'place',
    lat       decimal not null,
    lng       decimal not null,
    address   text,
    created   timestamp not null default current_timestamp
*/

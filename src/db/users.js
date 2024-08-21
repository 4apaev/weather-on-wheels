import Query, { where } from './db.js'

const TABLE = 'users'

/**
 * @prop   { object } params
 * @return { Promise<QRes> }
 */
export const query = where(TABLE, 'id', 'name', 'mail')

/**
 * @prop   { string } name
 * @prop   { string } mail
 * @prop   { string } pass
 * @return { Promise<QRes> }
 */
export function create({ name, mail, pass }) {
    return Query(`
    insert into ${ TABLE }(name, mail, pass)
        values($1, $2, crypt($3, gen_salt('bf')))
        returning
            id,
            name,
            mail;
    `, [ name, mail, pass ])
}

/**
 * @prop   { string } id
 * @return { Promise<QRes> }
 */
export function get({ id }) {
    return Query(`
        select id, name, mail from ${ TABLE }
            where
                id=$1
            limit
                1;
    `, [ id ])
}

/**
 * @prop   { string } mail
 * @prop   { string } pass
 * @return { Promise<QRes> }
 */
export function auth({ mail, pass }) {
    return Query(`
    select id, name, mail from ${ TABLE }
        where
            mail = $1
        and
            pass = crypt($2, pass)
        limit
            1;
    `, [ mail, pass ])
}

/** @typedef { import("./db.js").QRes } QRes */

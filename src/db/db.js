import Pg from 'pg'

const {
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env

export const pool = new Pg.Pool({
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    password: POSTGRES_PASSWORD,
})

pool.on('connect', () => console.log('[pool] connected'))
pool.on('remove', () => console.log('[pool] client removed'))
pool.on('error', e => console.error(`[pool:error]`, e))

/** @type { Query } */
export default async function query(sql, params = []) {
    let error, result
    try {
        result = await pool.query(sql, params)
        return {
            error,
            result,
            value: result?.rows ?? [],
        }
    }

    catch (e) {
        console.error('[db:error]', e.message)
        return {
            error: e,
            result,
            value: [],
        }
    }
}

/**
 * @param  { TemplateStringsArray } s
 * @param  { any[] } a
 */
export function tmpl(s, ...a) {
    return query(String.raw(s, ...a), [])
}

query.tmpl = tmpl

/**
 * @param  { string } table
 * @param  { string[] } keys
 * @return { Where }
 */
export function where(table, ...keys) {
    const head = `select "${ keys.join('", "') }" from ${ table }`

    return (props, limit) => {
        let i = 0
        let params = []
        let values = []
        let q = [ head ]

        for (let k of keys) {
            if (k in props) {
                params.push(`    ${ k } = $${ ++i }`)
                values.push(props[ k ])
            }
        }

        params.length && q.push('where', params.join(`\n  and\n`))
        q.push(`limit ${ limit ?? props.limit ?? 10 };`)
        return query(q.join(`\n  `), values)
    }
}

/**
 * @typedef { Object } QRes
 * @prop { import('pg').DatabaseError | Error } [error]
 * @prop { import('pg').QueryResult } result
 * @prop { ? } value
 */

/** @typedef { string | import('pg').QueryArrayConfig } QString                    */
/** @typedef { (props: Object<string, *>, limit?: number) => Promise<QRes> } Where */
/** @typedef { (sql: QString, params?: *[]) => Promise<QRes> } Query               */

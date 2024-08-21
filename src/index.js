import Http from 'node:http'

import end from './mw/endRequest.js'
import logger from './mw/logger.js'
import statiq from './mw/static.js'

import * as Location from './api/location.js'

process.loadEnvFile()

const {
    PWD,
    APP_PORT,
    APP_NAME,
    APP_HOST,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
    POSTGRES_USER,
    // POSTGRES_PASSWORD,
    PGDATA,

} = process.env

/**
 * @param { Req } rq
 * @param { Res } rs
 */
function start(rq, rs) {
    rq.URL = new URL(rq.url, APP_HOST)
    rq.path = rq.URL.pathname
    rq.query = Object.fromEntries(rq.URL.searchParams)

    logger(rq, rs)

    if (rq.method == 'GET') {
        if (rq.URL.pathname == '/api/location')       return Location.get(rq, rs)
        if (rq.URL.pathname == '/api/location/all')   return Location.all(rq, rs)
        if (rq.URL.pathname == '/api/location/query') return Location.query(rq, rs)
        /*                                         */ return statiq(rq, rs)
    }
    else if (rq.method == 'POST') {
        if (rq.URL.pathname == '/api/location')
            return Location.create(rq, rs)
    }

    end(rs, 405)
}

export const server = Http.createServer(start)

server.listen(APP_PORT, () => {
    console.table({
        PWD,
        APP_PORT: +APP_PORT,
        APP_NAME,
        APP_HOST,
        POSTGRES_DB,
        POSTGRES_PORT: +POSTGRES_PORT,
        POSTGRES_HOST,
        POSTGRES_USER,
        // POSTGRES_PASSWORD,
        PGDATA,
    })
})

/** @typedef { Http.IncomingMessage } Req */
/** @typedef { Http.ServerResponse } Res */

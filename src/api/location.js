import * as Locations from '../db/location.js'
import endRequest from '../mw/endRequest.js'

const { APP_HOST } = process.env

/** @typedef {import('node:http').IncomingMessage } Req */
/** @typedef {import('node:http').ServerResponse } Res */

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function create(rq, rs) {

    rq.setEncoding('utf-8')
    let body = ''

    for await (let chunk of rq)
        body += chunk

    ///////////////////////////////////////////////////////////////////////

    try {
        body = JSON.parse(body)
    }
    catch (e) {
        return endRequest(rs, 400, { error: new Error('Bad Request') })
    }

    ///////////////////////////////////////////////////////////////////////

    const msg = 'Failed to create Location'
    try {
        let result = await Locations.create(body)
        if (result.error)
            endRequest(rs, 500, { error: new Error(msg, { cause: result.error }) })
        else
            endRequest(rs, 200, result)
    }
    catch (cause) {
        endRequest(rs, 500, { error: new Error(msg, { cause }) })
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function query(rq, rs) {

    const isValid = 'lat' in rq.query
                 || 'lng' in rq.query
                 || 'kind' in rq.query

    if (!isValid) return endRequest(rs, 400, { error: new Error('Missing search params') })

    ///////////////////////////////////////////////////////////////////////

    const msg = 'Failed to query Location'

    try {

        let result = await Locations.query(rq.query)
        if (result.error)
            endRequest(rs, 500, { error: new Error(msg, { cause: result.error }) })
        else
            endRequest(rs, 200, result)

    }
    catch (cause) {
        endRequest(rs, 500, { error: new Error(msg, { cause }) })
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function all(rq, rs) {

    ///////////////////////////////////////////////////////////////////////

    const msg = 'Failed to find Location'

    try {

        const { limit = 10 } = rq.query

        let result = await Locations.all({ limit })
        if (result.error)
            endRequest(rs, 500, { error: new Error(msg, { cause: result.error }) })
        else
            endRequest(rs, 200, result)

    }
    catch (cause) {
        endRequest(rs, 500, { error: new Error(msg, { cause }) })
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function get(rq, rs) {

    const isValid = 'id' in rq.query

    if (!isValid) return endRequest(rs, 400, { error: new Error('Missing search params') })

    ///////////////////////////////////////////////////////////////////////

    const msg = 'Failed to find Location'

    try {
        let result = await Locations.get(rq.query)
        if (result.error)
            endRequest(rs, 500, { error: new Error(msg, { cause: result.error }) })
        else
            endRequest(rs, 200, result)

    }
    catch (cause) {
        endRequest(rs, 500, { error: new Error(msg, { cause }) })
    }
}

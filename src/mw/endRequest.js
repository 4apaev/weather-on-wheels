/**
 * @param {Http.ServerResponse} rs
 * @param {number} status
 * @param {any} data
 */
export default function endRequest(rs, status, data = {}) {

    data.error && console.error(data.error)

    const body = JSON.stringify(data)

    rs.statusCode = status
    rs.setHeader('content-type', 'application/json')
    rs.setHeader('content-length', Buffer.byteLength(body))
    rs.end(body)
}

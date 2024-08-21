import Fs from 'node:fs'
import Pt from 'node:path'

import endRequest from './endRequest.js'
import { error } from 'node:console'

const CWD = process.cwd()
const DIR = Pt.join(CWD, '/src/pub')

export const Mim = Object.create(null)

/**
 * @param { import('http').IncomingMessage } rq
 * @param { import('http').ServerResponse } rs
 */
export default function statiq(rq, rs) {
    if (rq.method != 'GET')
        return endRequest(rs, 405)

    const path = Pt.join(DIR, rq.url == '/'
        ? '/index.html'
        : rq.path)

    Fs.stat(path, (e, stat) => {
        if (e) return endRequest(rs, 404)

        if (!stat.isFile()) return endRequest(rs, 403)

        rs.statusCode = 200
        rs.setHeader('content-type', Mim[ Pt.extname(path) ] ?? Mim.txt)
        rs.setHeader('content-length', stat.size)
        Fs.createReadStream(path).pipe(rs)
    })
}

Mim[ '.txt' ]   = 'text/plain'
Mim[ '.html' ]  = 'text/html'
Mim[ '.css' ]   = 'text/css'
Mim[ '.less' ]  = 'text/less'
Mim[ '.csv' ]   = 'text/csv'
Mim[ '.jsx' ]   = 'text/jsx'
Mim[ '.md' ]    = 'text/x-markdown'
Mim[ '.csv' ]   = 'text/csv'
Mim[ '.jsx' ]   = 'text/jsx'
Mim[ '.yml' ]   = 'text/yaml'
Mim[ '.yaml' ]  = 'text/yaml'
Mim[ '.xml' ]   = 'text/xml'
Mim[ '.gif' ]   = 'image/gif'
Mim[ '.png' ]   = 'image/png'
Mim[ '.jpg' ]   = 'image/jpeg'
Mim[ '.jpeg' ]  = 'image/jpeg'
Mim[ '.webp' ]  = 'image/webp'
Mim[ '.svg' ]   = 'image/svg+xml'
Mim[ '.svgz' ]  = 'image/svg+xml'
Mim[ '.ico' ]   = 'image/x-icon'
Mim[ '.woff' ]  = 'font/woff'
Mim[ '.otf' ]   = 'font/opentype'
Mim[ '.zip' ]   = 'application/zip'
Mim[ '.tar' ]   = 'application/zip'
Mim[ '.bdf' ]   = 'application/x-font-bdf'
Mim[ '.pcf' ]   = 'application/x-font-pcf'
Mim[ '.snf' ]   = 'application/x-font-snf'
Mim[ '.ttf' ]   = 'application/x-font-ttf'
Mim[ '.bin' ]   = 'application/octet-stream'
Mim[ '.dmg' ]   = 'application/octet-stream'
Mim[ '.iso' ]   = 'application/octet-stream'
Mim[ '.img' ]   = 'application/octet-stream'
Mim[ '.js' ]    = 'application/javascript'
Mim[ '.json' ]  = 'application/json'
Mim[ '.form' ]  = 'multipart/form-data'
Mim[ '.query' ] = 'application/x-www-form-urlencoded'
Mim[ '.sse' ]   = 'text/event-stream'

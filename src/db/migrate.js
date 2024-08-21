import Fs from 'node:fs'
import Pt from 'node:path'

import { pool } from './db.js'

const ENC = 'utf-8'
const DIR = Pt.join(import.meta.dirname, '/sql')
const TMPL = `
    Error at: %s
        %s
        code: %s
        table: %s
        detail: %s
        constraint: %s
`

const dir = readdir(DIR, ENC)

let prev
function next(e, rs) {
    if (e) {
        console.error(TMPL, prev, e.message, e.code, e.table, e.detail, e.constraint, e.hint, e)
        process.exit(1)
    }

    prev && console.log(`end`, prev)
    rs && console.table(rs)

    const {
        done,
        value,
    } = dir.next()

    if (done) {
        console.log('finish')
        process.exit(0)
    }

    console.log('start', prev = value)

    const data = Fs.readFileSync(value, ENC)
    pool.query(data, next)
}

function toNumber(str) {
    return +str.match(/^\d+/)
}

function readdir(dir, enc) {
    return Fs.readdirSync(dir, enc)
        .filter(fname => fname.endsWith('.sql'))
        .map(fname => Pt.join(dir, fname))
        .sort((namea, nameb) => toNumber(namea) - toNumber(nameb))
        .values()
}

/**
 * Start Queue
 */
setTimeout(next, 10)

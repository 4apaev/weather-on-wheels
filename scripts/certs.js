#!/usr/bin/env node

import { exec } from 'node:child_process'
import parse from '../src/util/arguments.js'

const {
    prv,
    pub,
    alg,
    host,
    days,
} = parse(process.argv.slice(2), {
    prv: { short: 'P',  type: 'string',  default: process.cwd() + '/prv.pem' },
    pub: { short: 'p',  type: 'string',  default: process.cwd() + '/pub.pem' },
    alg: { short: 'a',  type: 'string',  default: 'rsa:2048'  },
    host: { short: 'h', type: 'string',  default: 'localhost' },
    days: { short: 'd', type: 'string',  default: 365  },
})

exec(`
    openssl
        req
        -x509
        -nodes
        -sha256
        -days ${ days }
        -newkey ${ alg }
        -subj '/CN=${ host }'
        -keyout ${ prv }
        -out ${ pub }
    `.trim().replace(/\n +/g, ' '))

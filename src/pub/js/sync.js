const Mim = Object.create(null)

class Head extends Headers {
    get(k) { return super.get(k) ?? '' }
    is(k, v) { return this.get(k).includes(v) }
}

export default class Sync {
    static BASE = location.origin
    static HEAD = new Head

    head = new Head(this.constructor.HEAD)
    method = 'get'

    constructor(method, url, body) {
        this.method = method || 'get'
        this.url = /^https?:/i.test(`${ url ??= '/' }`)
            ? new URL(url)
            : new URL(url, new.target.BASE)

        if (body != null) {
            if (this.method.toLowerCase() === 'get')
                this.query(body)
            else
                this.send(body)
        }
    }

    get headers() { return this.head }
    get params()  { return this.url.searchParams }

    has(k)        { return this.head.has(k) }
    get(k)        { return this.head.get(k) ?? '' }
    size(k)       { return k ? this.set(Mim.size, Mim[ k ] ?? k) : this.get(Mim.size) }
    type(k)       { return k ? this.set(Mim.type, Mim[ k ] ?? k) : this.get(Mim.type) }

    set(k, v) {
        if (k == null) return this
        typeof k == 'object'
            ? each(k, this.set, this)
            : this.head.set(k, v)
        return this
    }

    query(k, v) {
        if (k == null)
            return this

        if (Array.isArray(v))
            v.forEach(x => this.params.append(k, x))

        else if (typeof k == 'object')
            each(k, this.query, this)

        else
            this.params[ this.params.has(k) ? 'append' : 'set' ](k, v)

        return this
    }

    send(body) {
        if (body == null) return this
        if (typeof body == 'object') {
            this.type() || this.type(Mim.json)
            this.body = JSON.stringify(body)
        }
        else {
            this.body = `${ body }`
        }
        this.size() || this.size(this.body.length)
        return this
    }

    end() {
        return fetch(this.url, {
            body: this.body,
            method: this.method.toUpperCase(),
            headers: this.head,
        })
    }

    async then(done, fail) {
        try {
            const rs = await this.end()
            const pay = await this.parse(rs)
            return done
                ? done(pay)
                : Promise.resolve(pay)
        }
        catch (e) {
            return fail
                ? fail(e)
                : Promise.reject(e)
        }
    }

    async parse(rs) {
        const payload = {
            rs,
            ok: rs.ok,
            code: rs.status,
            headers: new Head(rs.headers),
            get head() { return this.headers },
            get status() { return this.code },
        }
        try {
            payload.body = payload.head.is(Mim.type, Mim.json)
                ? await rs.json()
                : await rs.text()
        }
        catch (e) {
            payload.error = e
        }
        return rs.ok
            ? payload
            : Promise.reject(payload)
    }

    static get(url, body)  { return Reflect.construct(this, [ 'get',    url, body ]) }
    static put(url, body)  { return Reflect.construct(this, [ 'put',    url, body ]) }
    static post(url, body) { return Reflect.construct(this, [ 'post',   url, body ]) }
    static del(url, body)  { return Reflect.construct(this, [ 'delete', url, body ]) }
}

function each(it, cb, ctx) {
    for (let [ k, v ] of it?.entries?.() ?? Object.entries(it))
        cb.call(ctx, k, v)
    return ctx
}

Mim.type   = 'content-type'
Mim.size   = 'content-length'

Mim.txt   = 'text/plain'
Mim.html  = 'text/html'
Mim.css   = 'text/css'
Mim.less  = 'text/less'
Mim.csv   = 'text/csv'
Mim.jsx   = 'text/jsx'
Mim.md    = 'text/x-markdown'
Mim.csv   = 'text/csv'
Mim.jsx   = 'text/jsx'
Mim.yml   = 'text/yaml'
Mim.yaml  = 'text/yaml'
Mim.xml   = 'text/xml'
Mim.gif   = 'image/gif'
Mim.png   = 'image/png'
Mim.jpg   = 'image/jpeg'
Mim.jpeg  = 'image/jpeg'
Mim.webp  = 'image/webp'
Mim.svg   = 'image/svg+xml'
Mim.svgz  = 'image/svg+xml'
Mim.ico   = 'image/x-icon'
Mim.woff  = 'font/woff'
Mim.otf   = 'font/opentype'
Mim.zip   = 'application/zip'
Mim.tar   = 'application/zip'
Mim.bdf   = 'application/x-font-bdf'
Mim.pcf   = 'application/x-font-pcf'
Mim.snf   = 'application/x-font-snf'
Mim.ttf   = 'application/x-font-ttf'
Mim.bin   = 'application/octet-stream'
Mim.dmg   = 'application/octet-stream'
Mim.iso   = 'application/octet-stream'
Mim.img   = 'application/octet-stream'
Mim.js    = 'application/javascript'
Mim.json  = 'application/json'
Mim.form  = 'multipart/form-data'
Mim.query = 'application/x-www-form-urlencoded'
Mim.sse   = 'text/event-stream'

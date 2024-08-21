import Sync from './sync.js'

let map, Marker

export async function initMap({ lat, lng }) {

    const center = { lat: +lat, lng: +lng }

    const { Map } = await google.maps.importLibrary('maps')
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

    globalThis.Marker = Marker = AdvancedMarkerElement

    map = globalThis.map = new Map(document.getElementById('map'), {
        zoom: 16,
        center,
        mapId: 'weather-app',
    })

    globalThis.marker = new AdvancedMarkerElement({
        map,
        position: center,
    })

    google.maps.event.addListener(map, 'click', e => {

        const loc = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        const locname = prompt(`create location at
            lat: ${ loc.lat }
            lng: ${ loc.lng }
            ??
        `)
        loc.name = locname
        Sync.post('/api/location', loc)

    })

}

export async function renderLocations() {
    const { body: { value }} = await Sync
        .get('/api/location/all')
        .query({ limit: 10 })

    const frag = document.createDocumentFragment()

    for (const loc of value) {
        const li = document.createElement('li')
        li.textContent = `${ loc.kind } - ${ loc.name.trim() }`
        frag.appendChild(li)
    }

    document.getElementById('locations')
        .appendChild(frag)

    initMap(value[ 0 ])
}

export function createLoation() {
    const form = document.getElementById('create')

    form.addEventListener('submit', async e => {

        e.preventDefault()
        e.stopPropagation()

        form.lastElementChild.disabled = true
        const loc = {
            name: form.elements.name.value,
            kind: form.elements.kind.value,
            lat: form.elements.lat.value,
            lng: form.elements.lng.value,
            address: form.elements.address.value,
        }

        console.log(loc)

        await Sync.post('/api/location', loc)
        form.lastElementChild.disabled = false
        history.back()
        form.lastElementChild.disabled = false
    })

}

export function getLoation(id) {
    return Sync.get('/api/location').query({ id })
}

export function queryLoations(query) {
    return Sync.get('/api/location/query').query(query)
}

const staticCacheName = 's-app-v1'
const dinamicCacheName = 'd-app-v1'
const assetsUrls = [
    '/index.html',
    '/offline.html',
    '/js/script.js',
    '/css/normalize.css',
    '/css/style.css',
]

self.addEventListener('install', async () => {
    const cache = await caches.open(staticCacheName)

    cache.addAll(assetsUrls)
})

self.addEventListener('activate', async () => {
    const cacheNames = await caches.keys()

    cacheNames
    .filter(name => name !== staticCacheName)
    .filter(name => name !== dinamicCacheName)
    .map(name => caches.delete(name))
})

self.addEventListener('fetch', evt => {
    const {request} = evt
    const url = new URL(request.url)
    const strategy = url.origin === location.origin ? cacheFirst(request) : networkFirst(request)

    evt.respondWith(strategy)
})

async function cacheFirst(request) {
    const cached = await caches.match(request)

    return cached ?? await fetch(request)
}

async function networkFirst(request) {
    const cache = await caches.open(dinamicCacheName) 

    try {
        const response = await fetch(request)

        await cache.put(request, response.clone())

        return response
    } catch(e) {
        const cached = await cache.match(request)

        return cached ?? await caches.match('/offline.html')
    }
}
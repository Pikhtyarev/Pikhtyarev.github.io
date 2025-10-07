const cache = {
    result: null
};

const slowFunction = (timeout = 3000) => {
    let start = performance.now();
    let x = 0;
    let i = 0;
    do {
        i += 1;
        x += (Math.random() - 0.5) * i;
    } while(performance.now() - start < timeout);
    console.log('end', x);
    return x;
};

const recalculate = (timeout) => {
    cache.result = slowFunction(timeout);
    return cache.result;
};

const getCachedResult = (timeout) => {
    const cachedResult = cache.result;
    if (cachedResult) {
        return cachedResult;
    } else {
        return recalculate(timeout);
    }
};

const broadcast = async (message) => {
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage(message);
    }
};

self.addEventListener('activate', async (evt) => {
    console.log('activate', evt);
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('message', evt => {
    console.log('message', evt);
    const { type, timeout } = evt.data;
    
    if (type === 'GET_CACHED') {
        const result = getCachedResult(timeout);
        const isCached = cache.result === result;
        broadcast({ type: 'RESULT', data: result, cached: isCached });
    } else if (type === 'RECALCULATE') {
        const result = recalculate(timeout);
        broadcast({ type: 'RESULT', data: result, cached: false });
    }
});

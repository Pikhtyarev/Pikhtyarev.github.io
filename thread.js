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
}
const bc = new BroadcastChannel('test_channel');

bc.postMessage({ type: 'ready' });

bc.onmessage = (event) => {
    const data = event.data;
    if (data.type === 'run') {
        const result = slowFunction(data.timeout);
        bc.postMessage({ type: 'result', result });
    }
};

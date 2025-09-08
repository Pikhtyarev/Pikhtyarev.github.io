self.addEventListener('message', evt => {
    const timeout = evt.data.timeout;
    const child = new Worker('thread2.js');

    child.addEventListener('message', e => {
        self.postMessage(e.data);
        child.terminate();
    });

    child.postMessage({ timeout });
});

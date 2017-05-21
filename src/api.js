const afterwares = [];
const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function uriFor(path) {
    return '/api' + path;
}

const Api = {
    addAfterWare(handler) {
        afterwares.push(handler);
    },

    async request (method, path, data = {}, options = {}) {
        let response = await fetch(uriFor(path), Object.assign({}, {
            method: method,
            credentials: 'include',
            headers: requestHeaders,
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        }, options));

        afterwares.map(async (handler) => {
            await handler(response);
        });

        return response;
    },

    post(path, data, options) {
        return this.request('POST', path, data, options);
    },

    delete(path, data, options) {
        return this.request('DELETE', path, data, options);
    },

    get(path, queryParams, options) {
        return this.request('GET', path, queryParams, options);
    },

    profile() {
        return this.get('/profile?full=1')
    },

    getUser(id) {
        return this.get('/user/' + id)
    },

    create(name, data) {
        return this.post('/app/create', { name, data })
    },

    destroy(id, force = 1) {
        return this.request('DELETE', `/app/${id}?force=${force}`)
    },

    async logout() {
        return await fetch('/logout', {
            method: 'POST',
            credentials: 'include',
            headers: requestHeaders
        })
    },
};

export default Api;

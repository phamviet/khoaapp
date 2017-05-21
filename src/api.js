const afterwares = [];
const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function uriFor(path) {
    return '/api' + path;
}

export default {
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

    postJson(path, data, options) {
        return this.request('POST', path, data, options);
    },

    getJson(path, queryParams, options) {
        return this.request('GET', path, queryParams, options);
    },

    profile() {
        return this.getJson('/profile?full=1')
    },

    getUser(id) {
        return this.getJson('/user/' + id)
    },

    create(name, data) {
        return this.postJson('/app/create', {name, data})
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
}

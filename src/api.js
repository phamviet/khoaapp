const afterwares = [];

function pathToUri(path) {
    return '/api' + path;
}

export default {
    addAfterWare(handler) {
        afterwares.push(handler);
    },

    async requestJson (method, path, data = {}, options = {}) {
        let response = await fetch(pathToUri(path), Object.assign({}, {
            method: method,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        }, options));

        afterwares.map(async (handler) => {
            await handler(response);
        });

        return response;
    },

    postJson(path, data, options) {
        return this.requestJson('POST', path, data, options);
    },

    getJson(path, queryParams, options) {
        return this.requestJson('GET', path, queryParams, options);
    },

    ping() {
        return this.postJson('/ping')
    },

    profile() {
        return this.getJson('/profile')
    },

    create(name, data) {
        return this.postJson('/app', {name, data})
    },

    destroy(id, force = 1) {
        return this.requestJson('DELETE', `/app/${id}?force=${force}`)
    },

    logout() {
        return this.postJson('/logout')
    },
}
